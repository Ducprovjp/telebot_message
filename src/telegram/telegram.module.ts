import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MessageHandlerModule } from '../shared/message-handler/message-handler.module';
import { TelegramService } from './telegram.service';

@Module({
  imports: [ConfigModule, MessageHandlerModule],
  providers: [TelegramService],
})
export class TelegramModule {}
