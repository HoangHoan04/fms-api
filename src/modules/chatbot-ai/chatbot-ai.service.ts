import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { streamText, StreamTextResult, ToolSet } from 'ai';

@Injectable()
export class ChatBotAIService {
  private provider;
  private readonly MODEL = 'thinhphoenix/nobody';

  constructor(private configService: ConfigService) {
    this.provider = createOpenAICompatible({
      name: this.configService.get<string>(
        'AI_PROVIDER_NAME',
        'custom-provider',
      ),
      apiKey: this.configService.get<string>('AI_PROVIDER_API_KEY'),
      baseURL: this.configService.get<string>(
        'AI_PROVIDER_BASE_URL',
        'https://api.provider.com/v1',
      ),
      includeUsage: true,
    });
  }

  chat(messages: any[]): StreamTextResult<ToolSet, any> {
    return streamText({
      model: this.provider(this.MODEL),
      messages,
    });
  }

  generateRoadmap(data: {
    cert: string;
    target: string;
    weakness: string[];
    timeframe: number;
  }): StreamTextResult<ToolSet, any> {
    const prompt = `Bạn là một chuyên gia tư vấn giáo dục và luyện thi chứng chỉ ngoại ngữ cao cấp. Hãy giúp thành viên xây dựng một chiến lược chinh phục mục tiêu tối ưu.

      Thông tin thành viên:
      - Chứng chỉ mục tiêu: ${data.cert}
      - Điểm mục tiêu: ${data.target}
      - Kỹ năng cần tập trung (Yếu): ${data.weakness.join(', ')}
      - Thời gian: ${data.timeframe} tháng

      Yêu cầu chi tiết lộ trình:
      1. **Tổng quan chiến lược**: Phân tích ngắn gọn về mục tiêu và cách tiếp cận.
      2. **Chia 3-4 giai đoạn (Phases)**: Mỗi giai đoạn BẮT BUỘC bắt đầu bằng tiêu đề H2 theo định dạng chính xác: \`## PHASE X: [Tên giai đoạn]\` (ví dụ: \`## PHASE 1: XÂY DỰNG NỀN TẢNG\`).
          - Mỗi giai đoạn cần:
              - **Thời lượng** cụ thể.
              - **Mục tiêu chính**.
              - **Kế hoạch hàng tuần (Weekly Focus)**.
      3. **Thời gian biểu mẫu (Sample Daily Schedule)**: Đề xuất một lịch học mẫu hàng ngày (ví dụ: 5:00-6:00, 19:00-21:00) tối ưu cho thành viên bận rộn.
      4. **Tài nguyên học tập**: Gợi ý các giáo trình, trang web hoặc ứng dụng cụ thể phù hợp với trình độ mục tiêu.
      5. **Lời khuyên từ chuyên gia**: Các tips để duy trì động lực và cải thiện kỹ năng yếu.

      Định dạng yêu cầu:
      - Sử dụng **Markdown** mạnh mẽ (Heading 1 cho tiêu đề lớn, Heading 2 cho các Phase).
      - Sử dụng **Bảng (Table)** để trình bày Thời gian biểu.
      - Sử dụng **Emoji** để làm nội dung sinh động.
      - Ngôn ngữ: Tiếng Việt, văn phong chuyên nghiệp, truyền cảm hứng và cực kỳ chi tiết.`;

    return streamText({
      model: this.provider(this.MODEL),
      messages: [{ role: 'user', content: prompt }],
    });
  }
}
