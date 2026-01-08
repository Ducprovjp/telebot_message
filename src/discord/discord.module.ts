import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MessageHandlerModule } from '../shared/message-handler/message-handler.module';
import { DiscordService } from './discord.service';

@Module({
  imports: [ConfigModule, MessageHandlerModule],
  providers: [DiscordService],
  exports: [DiscordService],
})
export class DiscordModule {}
