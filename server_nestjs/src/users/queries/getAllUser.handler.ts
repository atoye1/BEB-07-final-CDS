import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Users } from '../../entities/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllUserQuery } from './getAllUser.query';

@QueryHandler(GetAllUserQuery)
export class GetAllUserHandler implements IQueryHandler<GetAllUserQuery> {
  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
  ) {}

  async execute(): Promise<any> {
    const users = await this.userRepository.find();
    if (!users) throw new NotFoundException('no such user');
    return users;
  }
}
