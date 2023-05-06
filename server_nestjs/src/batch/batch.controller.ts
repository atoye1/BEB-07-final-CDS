import { Post, Controller, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';

@Controller('batch')
export class BatchController {
  constructor(private scheduler: SchedulerRegistry, private logger: Logger) {}

  @Post('/start-sample')
  start() {
    const job = this.scheduler.getCronJob('5cronSample');
    job.start();
    this.logger.warn('START!!', job.lastDate());
  }

  @Post('/stop-sample')
  stop() {
    const job = this.scheduler.getCronJob('5cronSample');
    job.stop();
    this.logger.warn('STOPED!!', job.lastDate());
  }
}
