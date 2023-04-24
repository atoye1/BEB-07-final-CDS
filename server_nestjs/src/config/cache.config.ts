import { CacheModuleOptions } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-ioredis';

export const cacheConfig = {
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => {
    const option: CacheModuleOptions = {
      ttl: 1000,
      isGlobal: true,
    };
    if (configService.get('NODE_ENV') === 'development') {
      return option;
    }
    console.log('ENV is not development');
    option.store = redisStore;
    option.host = configService.get('REDIS_HOST');
    option.port = configService.get('REDIS_PORT');
    return option;
  },
  inject: [ConfigService],
};
