import { Logger, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Users, Swaps, Transactions } from 'entities';
import { MyCacheModule } from 'cache/cache.module';
import { Web3AuthGuard } from 'auth/web3-auth.guard';
import { UsersController } from './users.controller';

import { UpdateMyInfoHandler } from './commands/updateMyInfo.handler';
import {
  GetAllUserHandler,
  GetUserInfoHandler,
  GetUserSwapsHandler,
  GetUserTransactionsHandler,
} from './queries';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([Users, Swaps, Transactions]),
    MyCacheModule,
  ],
  controllers: [UsersController],
  providers: [
    Logger,
    GetAllUserHandler,
    GetUserInfoHandler,
    GetUserSwapsHandler,
    GetUserTransactionsHandler,
    UpdateMyInfoHandler,
    Web3AuthGuard,
  ],
})
export class UsersModule {}
