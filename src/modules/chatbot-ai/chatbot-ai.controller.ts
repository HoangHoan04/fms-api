import { Controller, Post, Body, Res, HttpCode } from '@nestjs/common';
import { Response } from 'express';
import { ChatBotAIService } from './chatbot-ai.service';

@Controller('chatbot-ai')
export class ChatBotAIController {
  constructor(private readonly service: ChatBotAIService) {}

  @Post('chat')
  @HttpCode(200)
  async chat(@Body() body: { messages: any[] }, @Res() res: Response) {
    const result = this.service.chat(body.messages);

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Accel-Buffering', 'no');
    res.setHeader('Connection', 'keep-alive');

    try {
      for await (const textPart of result.textStream) {
        process.stdout.write(textPart); // Log to console without newlines
        res.write(textPart);
      }
    } catch (err) {
      console.error('Streaming error:', err);
    } finally {
      res.end();
    }
  }

  @Post('generate-roadmap')
  @HttpCode(200)
  async generateRoadmap(
    @Body()
    body: {
      cert: string;
      target: string;
      weakness: string[];
      timeframe: number;
    },
    @Res() res: Response,
  ) {
    const result = this.service.generateRoadmap(body);

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Accel-Buffering', 'no');
    res.setHeader('Connection', 'keep-alive');

    try {
      for await (const textPart of result.textStream) {
        res.write(textPart);
      }
    } catch (err) {
      console.error('Roadmap streaming error:', err);
    } finally {
      res.end();
    }
  }
}
