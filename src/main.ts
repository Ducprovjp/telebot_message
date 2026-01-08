import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DiscordService } from './discord/discord.service';
import { TelegramService } from './telegram/telegram.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();
  const discordService = app.get(DiscordService);
  const telegramService = app.get(TelegramService);
  void discordService.start();
  void telegramService.start();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
