import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Telegraf, Context } from 'telegraf';

@Injectable()
export class TelegramService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(TelegramService.name);
  private readonly bot: Telegraf<Context>;
  private readonly defaultReply: string;

  constructor(private readonly configService: ConfigService) {
    const token = this.configService.get<string>('TELEGRAM_BOT_TOKEN');
    if (!token) {
      throw new Error(
        'TELEGRAM_BOT_TOKEN is not defined in the environment variables.',
      );
    }
    this.defaultReply =
      this.configService.get<string>('TELEGRAM_DEFAULT_REPLY') ??
      'Hello from NestJS!';
    this.bot = new Telegraf(token);

    this.bot.on('text', (ctx) => {
      void ctx.reply(this.defaultReply);
    });
  }

  async onModuleInit() {
    await this.bot.launch();
    this.logger.log('Bot started');
  }

  onModuleDestroy() {
    this.bot.stop('Module destroyed');
  }
}
