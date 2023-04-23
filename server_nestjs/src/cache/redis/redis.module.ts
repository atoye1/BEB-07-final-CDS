import { Module } from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';
import * as dotenv from 'dotenv';
import { RedisCacheService } from './redis.service';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
dotenv.config();

const cacheModule = CacheModule.registerAsync({
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => ({
    store: 'redisStore',
    host: process.env.REDIS_HOST, // env에서 정의함
    port: process.env.REDIS_PORT, // env에서 정의함
    ttl: 1000, // 캐시 유지 시간
  }),
  inject: [ConfigService],
});

@Module({
  imports: [cacheModule],
  providers: [RedisCacheService],
  exports: [RedisCacheService],
})
export class RedisCacheModule {}
