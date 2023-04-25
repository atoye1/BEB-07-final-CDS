import { IQuery } from '@nestjs/cqrs';

export class GetUserTransactionsQuery implements IQuery {
  constructor(readonly address: string) {}
}
