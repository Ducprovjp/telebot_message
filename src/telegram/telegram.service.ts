import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Telegraf, Context } from 'telegraf';
import { MessageHandlerService } from '../shared/message-handler/message-handler.service';

@Injectable()
export class TelegramService implements OnModuleDestroy {
  private readonly logger = new Logger(TelegramService.name);
  private readonly bot: Telegraf<Context>;
  private started = false;

  constructor(
    private readonly configService: ConfigService,
    private readonly messageHandlerService: MessageHandlerService,
  ) {
    const token = this.configService.get<string>('TELEGRAM_BOT_TOKEN');
    if (!token) {
      throw new Error(
        'TELEGRAM_BOT_TOKEN is not defined in the environment variables.',
      );
    }
    this.bot = new Telegraf(token);

    this.bot.on('text', (ctx) => {
      const reply = this.messageHandlerService.handleMessage(ctx.message.text);
      void ctx.reply(reply);
    });
  }

  async start() {
    if (this.started) {
      return;
    }
    this.started = true;
    this.logger.log('Starting Telegram bot...');
    const warningTimer = setTimeout(() => {
      this.logger.warn('Telegram bot launch is taking longer than expected.');
    }, 10000);
    try {
      await this.bot.launch();
      this.logger.log('Telegram bot started');
    } catch (error) {
      this.started = false;
      const trace = error instanceof Error ? error.stack : String(error);
      this.logger.error('Failed to launch Telegram bot', trace);
      throw error;
    } finally {
      clearTimeout(warningTimer);
    }
  }

  onModuleDestroy() {
    this.bot.stop('Module destroyed');
  }
}
