import { Controller, Get, Inject, Logger } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  private logger = new Logger('AppController');

  constructor(
    private readonly appService: AppService,
    @Inject('CUSTOM_KEY') private readonly customValue,
  ) {}

  @Get()
  getHello(): string {
    this.logger.verbose(this.customValue);
    return this.appService.getHello();
  }
}
