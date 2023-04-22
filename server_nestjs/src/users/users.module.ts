import { Logger, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { GetAllUserHandler } from './query/getAllUser.handler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entities/users.entity';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([Users])],
  controllers: [UsersController],
  providers: [Logger, GetAllUserHandler],
})
export class UsersModule {}
