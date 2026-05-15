import { Module } from '@nestjs/common';
import { ChatBotAIService } from './chatbot-ai.service';
import { ChatBotAIController } from './chatbot-ai.controller';

@Module({
  controllers: [ChatBotAIController],
  providers: [ChatBotAIService],
  exports: [ChatBotAIService],
})
export class ChatBotAIModule {}
