import { Logger, Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { PriceFeedService } from './priceFeed.service';
import { BatchController } from './batch.controller';
import { MyCacheModule } from '../cache/cache.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [ScheduleModule.forRoot(), MyCacheModule, HttpModule],
  controllers: [BatchController],
  providers: [PriceFeedService, Logger],
})
export class BatchModule {}
