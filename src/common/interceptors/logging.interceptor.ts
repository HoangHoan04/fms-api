import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import axios from 'axios';
import * as os from 'os';
import { performance } from 'perf_hooks';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

const THRESHOLD_DURATION = Number(process.env.PERF_THRESHOLD_DURATION) || 10000; // ms
const THRESHOLD_MEMORY = Number(process.env.PERF_THRESHOLD_MEMORY) || 500; // MB
const THRESHOLD_CPU = Number(process.env.PERF_THRESHOLD_CPU) || 500; // ms
const THRESHOLD_STALL = Number(process.env.PERF_THRESHOLD_STALL) || 500; // ms – event-loop lag
const CHECK_INTERVAL_MS = 50;

@Injectable()
export class LogInterceptor implements NestInterceptor {
  private readonly logger = new Logger('PerformanceAlert');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, ip } = request;
    const body = this.normalizeBody(request.body);
    const bodyStr = JSON.stringify(body);
    const PROJECT = process.env.PROJECT_NAME || 'LINGOARENA';
    const SOURCE = process.env.SOURCE_CODE || 'LINGOARENA_API';
    const ENV = process.env.ENVIRONMENT || 'DEVELOP';
    const startTime = performance.now();
    const startMemory = process.memoryUsage();
    const startCpu = process.cpuUsage();
    let maxLagMs = 0;
    let expected = Date.now() + CHECK_INTERVAL_MS;
    const itv = setInterval(() => {
      const now = Date.now();
      const lag = now - expected; // >0 nghĩa là event-loop bị trễ
      if (lag > maxLagMs) maxLagMs = lag;
      expected = now + CHECK_INTERVAL_MS;
    }, CHECK_INTERVAL_MS);
    itv.unref?.();

    return next.handle().pipe(
      tap(() => {
        clearInterval(itv);

        const endTime = performance.now();
        const endMemory = process.memoryUsage();
        const cpuUsageDiff = process.cpuUsage(startCpu);
        const duration = endTime - startTime; // ms
        const memoryDiffMB =
          (endMemory.heapUsed - startMemory.heapUsed) / 1024 / 1024;
        const cpuTimeMs = (cpuUsageDiff.user + cpuUsageDiff.system) / 1000; // ms
        const stallMs = Math.max(0, Math.round(maxLagMs));

        const isSlowReq = duration > THRESHOLD_DURATION;
        const isMemoryHigh = memoryDiffMB > THRESHOLD_MEMORY;
        const isCpuHigh = cpuTimeMs > THRESHOLD_CPU;
        const isStalled = stallMs > THRESHOLD_STALL;
        if (!isSlowReq && !isMemoryHigh && !isCpuHigh && !isStalled) return;
        this.logger.warn(
          `[HOTPATH ${method} ${url}]` +
            ` dur=${Math.round(duration)}ms` +
            ` stall=${stallMs}ms` +
            ` mem=${memoryDiffMB.toFixed(2)}MB` +
            ` cpu=${cpuTimeMs.toFixed(2)}ms` +
            ` body=${bodyStr}`,
        );

        const className = context.getClass().name;
        const handlerName = context.getHandler().name;
        const timestamp = new Date().toLocaleString('vi-VN', {
          timeZone: 'Asia/Ho_Chi_Minh',
        });
        const currentRSS = (endMemory.rss / 1024 / 1024).toFixed(2);
        const currentHeap = (endMemory.heapUsed / 1024 / 1024).toFixed(2);
        const podHostname = os.hostname();
        const loadAvg = os.loadavg()[0].toFixed(2);

        const issueFlags =
          (isSlowReq ? '🐢 Slow ' : '') +
          (isMemoryHigh ? '🐘 Memory ' : '') +
          (isCpuHigh ? '🔥 CPU ' : '') +
          (isStalled ? '🧱 Stall ' : '');

        const message =
          `🚀 *[${PROJECT}] PERFORMANCE ALERT*\n` +
          `────────────────────\n` +
          `📍 *Project:* \`${PROJECT}\` | *Env:* \`${ENV}\`\n` +
          `🏗 *Source:* \`${SOURCE}\`\n` +
          `🆔 *Pod ID:* \`${podHostname}\`\n` +
          `────────────────────\n` +
          `🔴 *Issue:* ${issueFlags}\n` +
          `🛣 *Route:* \`${method} ${url}\`\n` +
          `🧩 *Handler:* \`${className}.${handlerName}\`\n` +
          `────────────────────\n` +
          `📝 *Body:* \`${bodyStr.slice(0, 300)}${bodyStr.length > 300 ? '…' : ''}\`\n` +
          `────────────────────\n` +
          `📊 *Execution Metrics (Diff):*\n` +
          `• ⏱ *Time:*  \`${duration.toFixed(2)}ms\` / ${THRESHOLD_DURATION}ms\n` +
          `• 💾 *RAM:*   \`${memoryDiffMB.toFixed(2)}MB\` / ${THRESHOLD_MEMORY}MB\n` +
          `• ⚙️ *CPU:*   \`${cpuTimeMs.toFixed(2)}ms\` / ${THRESHOLD_CPU}ms\n` +
          `• 🧱 *Stall:* \`${stallMs}ms\` / ${THRESHOLD_STALL}ms\n` +
          `────────────────────\n` +
          `📦 *Pod Real-time Status (Total):*\n` +
          `• 🏠 *Actual RAM (RSS):* \`${currentRSS} MB\`\n` +
          `• 💎 *V8 Heap Used:*     \`${currentHeap} MB\`\n` +
          `• 📈 *System Load:*      \`${loadAvg}\` (avg 1m)\n` +
          `────────────────────\n` +
          `👥 *Client IP:* \`${ip}\` | ⏰ *At:* ${timestamp}`;

        this.sendTelegramAlert(message);
      }),
    );
  }

  /**
   * Rút gọn body để tránh stringify object khổng lồ khi log.
   * Array  → { __isArray: true, length }
   * Object sâu quá 3 cấp → { __isObject: true, length }
   * String > 50 ký tự    → 'STR_LEN_N'
   */
  private normalizeBody(body: any, lv = 1): any {
    if (!body || typeof body !== 'object') return body ?? {};

    const clone: Record<string, any> = {};

    for (const key of Object.keys(body)) {
      const val = body[key];

      if (Array.isArray(val)) {
        clone[key] = { __isArray: true, length: val.length };
      } else if (val && typeof val === 'object') {
        clone[key] =
          lv >= 3
            ? { __isObject: true, length: Object.keys(val).length }
            : this.normalizeBody(val, lv + 1);
      } else if (typeof val === 'string' && val.length > 50) {
        clone[key] = `STR_LEN_${val.length}`;
      } else {
        clone[key] = val;
      }
    }

    return clone;
  }

  private async sendTelegramAlert(message: string): Promise<void> {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_GROUP_ID;
    if (!botToken || !chatId) return;

    await axios
      .post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown',
      })
      .catch((err) =>
        this.logger.error(`Telegram Alert Error: ${err.message}`),
      );
  }
}
