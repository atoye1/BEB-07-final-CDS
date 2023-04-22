import { IQuery } from '@nestjs/cqrs';

export class GetAllUserQuery implements IQuery {
  constructor(readonly notUsed: string) {
    console.log('getalluserQuery contructed');
  }
}
