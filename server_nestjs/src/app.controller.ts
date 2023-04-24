import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MyCacheService } from 'cache/cache.service';

@Controller()
export class AppController {
  constructor(
    // @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly appService: AppService,
    private readonly myCacheService: MyCacheService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/set-cache')
  async setCache(): Promise<string> {
    const now = new Date().getTime();
    await this.myCacheService.set('time', now, 10000);
    return Promise.resolve(`time set to ${now}`);
  }

  @Get('/del-cache')
  async delCache(): Promise<string> {
    await this.myCacheService.del('time');
    return Promise.resolve(`cache cleared`);
  }

  @Get('/get-cache')
  async getCache(): Promise<string> {
    const data = (await this.myCacheService.get('time')) as string;
    return data ? data : 'no cached value';
  }
}
