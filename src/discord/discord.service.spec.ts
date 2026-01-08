import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { DiscordService } from './discord.service';
import { MessageHandlerService } from '../shared/message-handler/message-handler.service';

describe('DiscordService', () => {
  let service: DiscordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DiscordService,
        {
          provide: ConfigService,
          useValue: {
            get: (key: string) => {
              if (key === 'DISCORD_BOT_TOKEN') {
                return 'test-token';
              }
              return undefined;
            },
          },
        },
        {
          provide: MessageHandlerService,
          useValue: {
            handleMessage: () => 'test-reply',
          },
        },
      ],
    }).compile();

    service = module.get<DiscordService>(DiscordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
