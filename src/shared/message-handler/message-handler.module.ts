import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MessageHandlerService } from './message-handler.service';

@Module({
  imports: [ConfigModule],
  providers: [MessageHandlerService],
  exports: [MessageHandlerService],
})
export class MessageHandlerModule {}
