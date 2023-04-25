import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Users } from '../../entities/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserInfoQuery } from './getUserInfo.query';

@QueryHandler(GetUserInfoQuery)
export class GetUserInfoHandler implements IQueryHandler<GetUserInfoQuery> {
  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
  ) {}

  async execute(query: GetUserInfoQuery): Promise<any> {
    const address = query.address;
    const userInfo = await this.userRepository.findOne({ where: { address } });

    if (!userInfo) throw new NotFoundException('no such user');
    return userInfo;
  }
}
