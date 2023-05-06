import { Repository } from 'typeorm';
import { Users, Swaps, Transactions } from '../../entities';
import { InjectRepository } from '@nestjs/typeorm';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserTransactionsQuery } from './getUserTransactions.query';

@QueryHandler(GetUserTransactionsQuery)
export class GetUserTransactionsHandler
  implements IQueryHandler<GetUserTransactionsQuery>
{
  constructor(
    @InjectRepository(Transactions)
    private transactionsRepository: Repository<Transactions>,
  ) {}

  async execute(query: GetUserTransactionsQuery): Promise<any> {
    const address = query.address;
    const txQuery = this.transactionsRepository
      .createQueryBuilder('transactions')
      .select('transactions')
      .innerJoin(Swaps, 'swaps', 'swaps.swapId = transactions.swapId')
      .innerJoin(
        Users,
        'users',
        'users.address = swaps.seller OR users.address = swaps.buyer',
      )
      .where(`users.address = "${address}"`);
    const transactions = await txQuery.getManyAndCount();
    const result = {
      address,
      totaltransactionCount: transactions[1],
      transactions: transactions[0],
    };
    return result;
  }
}
