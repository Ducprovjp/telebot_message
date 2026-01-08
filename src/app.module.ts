import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TelegramModule } from './telegram/telegram.module';
import { ConfigModule } from '@nestjs/config';
import { DiscordModule } from './discord/discord.module';
import { MessageHandlerModule } from './shared/message-handler/message-handler.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TelegramModule,
    DiscordModule,
    MessageHandlerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
