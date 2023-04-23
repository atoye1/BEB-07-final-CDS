import { Logger, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { GetAllUserHandler } from './query/getAllUser.handler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entities/users.entity';
import { UpdateMyInfoHandler } from './command/updateMyInfo.handler';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([Users])],
  controllers: [UsersController],
  providers: [Logger, GetAllUserHandler, UpdateMyInfoHandler],
})
export class UsersModule {}
