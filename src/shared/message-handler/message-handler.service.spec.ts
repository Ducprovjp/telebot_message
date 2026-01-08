import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { MessageHandlerService } from './message-handler.service';

describe('MessageHandlerService', () => {
  let service: MessageHandlerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessageHandlerService,
        {
          provide: ConfigService,
          useValue: {
            get: (key: string) => {
              if (key === 'DEFAULT_REPLY') {
                return 'test-reply';
              }
              return undefined;
            },
          },
        },
      ],
    }).compile();

    service = module.get<MessageHandlerService>(MessageHandlerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
