import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import axios from 'axios';
import { MyCacheService } from '../cache/cache.service';
import { HttpService } from '@nestjs/axios';
import { tap, map, firstValueFrom, pluck } from 'rxjs';

type PriceFeed = {
  usd_24h_change: number;
};

type PriceFeedDataCollection = {
  bitcoin: PriceFeed;
  ethereum: PriceFeed;
  chainlink: PriceFeed;
};

@Injectable()
export class PriceFeedService {
  constructor(
    private myCacheService: MyCacheService,
    private httpService: HttpService,
  ) {}
  private readonly logger = new Logger(PriceFeedService.name);
  geckoEndpoint =
    'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,chainlink&vs_currencies=usd&include_24hr_change=true&include_last_updated_at=true&precision=2';

  @Cron(CronExpression.EVERY_10_SECONDS, { name: 'updateGeckoFeed' })
  async updateGeckoFeed() {
    const result = await firstValueFrom(
      this.httpService.get(this.geckoEndpoint).pipe(map((x) => x?.data)),
    );
    // const priceData = this.transformPriceData(apiData.data);
    console.log({ result });
    this.logger.log('Gecko Price Feed updatd');
  }

  @Cron(CronExpression.EVERY_10_SECONDS, { name: 'updateChainLinkFeed' })
  async updateChainLinkFeed() {
    this.logger.log(`chainlink feed not implemented yet`);
  }

  private transformPriceData(data) {
    const result: PriceFeedDataCollection = {} as PriceFeedDataCollection;
    result.bitcoin.usd_24h_change = +data.bitcoin.usd_24h_change.toFixed(3);
    result.ethereum.usd_24h_change = +data.ethereum.usd_24h_change.toFixed(3);
    result.chainlink.usd_24h_change = +data.chainlink.usd_24h_change.toFixed(3);
    return result;
  }
}
