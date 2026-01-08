import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { TelegramService } from './telegram.service';

describe('TelegramService', () => {
  let service: TelegramService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TelegramService,
        {
          provide: ConfigService,
          useValue: {
            get: (key: string) => {
              if (key === 'TELEGRAM_BOT_TOKEN') {
                return 'test-token';
              }
              if (key === 'TELEGRAM_DEFAULT_REPLY') {
                return 'Test reply';
              }
              return undefined;
            },
          },
        },
      ],
    }).compile();

    service = module.get<TelegramService>(TelegramService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
