import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TelegramService } from './telegram.service';

@Module({
  imports: [ConfigModule],
  providers: [TelegramService],
})
export class TelegramModule {}
