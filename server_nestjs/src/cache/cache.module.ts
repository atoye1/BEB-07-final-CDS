import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { cacheConfig } from '../config/cache.config';
import { MyCacheService } from './cache.service';

@Module({
  imports: [CacheModule.registerAsync(cacheConfig)],
  providers: [MyCacheService],
  exports: [MyCacheService],
})
export class MyCacheModule {}
