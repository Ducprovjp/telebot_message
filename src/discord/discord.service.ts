import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client, GatewayIntentBits, Message } from 'discord.js';
import { MessageHandlerService } from '../shared/message-handler/message-handler.service';

@Injectable()
export class DiscordService implements OnModuleDestroy {
  private readonly logger = new Logger(DiscordService.name);
  private readonly client: Client;
  private started = false;
  private handlersBound = false;

  constructor(
    private readonly configService: ConfigService,
    private readonly messageHandlerService: MessageHandlerService,
  ) {
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
    });
  }

  private bindHandlers() {
    if (this.handlersBound) {
      return;
    }
    this.handlersBound = true;

    this.client.once('ready', () => {
      this.logger.log(`Logged in as ${this.client.user?.tag}!`);
    });

    this.client.on('warn', (message) => {
      this.logger.warn(message);
    });

    this.client.on('error', (error) => {
      const trace = error instanceof Error ? error.stack : String(error);
      this.logger.error('Discord client error', trace);
    });

    this.client.on('shardError', (error) => {
      const trace = error instanceof Error ? error.stack : String(error);
      this.logger.error('Discord shard error', trace);
    });

    this.client.on('messageCreate', (message: Message) => {
      if (message.author.bot) return;
      const reply = this.messageHandlerService.handleMessage(message.content);
      message.reply(reply).catch((error) => {
        const trace = error instanceof Error ? error.stack : String(error);
        this.logger.error('Failed to reply to Discord message', trace);
      });
    });
  }

  async start() {
    if (this.started) {
      return;
    }
    this.started = true;
    this.bindHandlers();

    const token = this.configService.get<string>('DISCORD_BOT_TOKEN');
    if (!token) {
      throw new Error(
        'DISCORD_BOT_TOKEN is not defined in the environment variables.',
      );
    }
    this.logger.log('Logging in to Discord...');
    try {
      await this.client.login(token);
      this.logger.log('Discord bot started');
    } catch (error) {
      this.started = false;
      const trace = error instanceof Error ? error.stack : String(error);
      this.logger.error('Failed to login to Discord', trace);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.client.destroy();
  }
}
