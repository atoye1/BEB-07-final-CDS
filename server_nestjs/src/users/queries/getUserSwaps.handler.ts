import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Swaps } from '../../entities/swaps.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserSwapsQuery } from './getUserSwaps.query';

@QueryHandler(GetUserSwapsQuery)
export class GetUserSwapsHandler implements IQueryHandler<GetUserSwapsQuery> {
  constructor(
    @InjectRepository(Swaps)
    private swapsRepository: Repository<Swaps>,
  ) {}

  async execute(query: GetUserSwapsQuery): Promise<any> {
    const address = query.address;
    const mySwaps = await this.swapsRepository.findAndCount({
      where: [{ seller: address }, { buyer: address }],
    });

    if (!mySwaps) throw new NotFoundException('swaps not found');

    const result = {
      address,
      totalSwapCount: mySwaps[1],
      swaps: mySwaps[0],
    };

    return result;
  }
}
