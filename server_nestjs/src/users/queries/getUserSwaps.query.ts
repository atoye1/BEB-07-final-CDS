import { IQuery } from '@nestjs/cqrs';

export class GetUserSwapsQuery implements IQuery {
  constructor(readonly address: string) {}
}
