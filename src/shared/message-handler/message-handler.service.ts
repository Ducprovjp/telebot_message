import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MessageHandlerService {
  private readonly defaultReply: string;

  constructor(private readonly configService: ConfigService) {
    this.defaultReply =
      this.configService.get<string>('DEFAULT_REPLY') ??
      'Hello from the shared message handler!';
  }

  handleMessage(message: string): string {
    // For now, we just return the default reply.
    // In the future, we could add more complex logic here.
    console.log(`Received message: ${message}`);
    return this.defaultReply;
  }
}
