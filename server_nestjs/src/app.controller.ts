import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Controller()
export class AppController {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly appService: AppService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/set-cache')
  async setCache(): Promise<string> {
    const now = new Date().getTime();
    await this.cacheManager.set('time', now, 10000);
    return Promise.resolve(`time set to ${now}`);
  }

  @Get('/del-cache')
  async delCache(): Promise<string> {
    await this.cacheManager.del('time');
    return Promise.resolve(`cache cleared`);
  }

  @Get('/get-cache')
  async getCache(): Promise<string> {
    const data = (await this.cacheManager.get('time')) as string;
    return data ? data : 'no cached value';
  }
}
