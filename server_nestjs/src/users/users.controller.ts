import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Inject,
  Logger,
  LoggerService,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { UpdateUserDto } from './dto/update-user.dto';
import { getAddressDto } from './dto/get-address.dto';
import { GetAllUserQuery } from './query/getAllUser.query';
import { UpdateMyInfoCommand } from './command/updateMyInfo.command';

@Controller('users')
export class UsersController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
    @Inject(Logger) private readonly logger: LoggerService,
  ) {}

  @Get()
  async getAllUser() {
    return await this.queryBus.execute(new GetAllUserQuery());
  }

  @Post('/my')
  async updateMyInfo(@Body() dto: UpdateUserDto) {
    //TODO make address dynamic from auth
    const address = '111';
    const { nickname, email } = dto;
    return await this.commandBus.execute(
      new UpdateMyInfoCommand(nickname, email, address),
    );
  }

  @Get('/my')
  async getMyInfo() {
    return `${this.getMyInfo.name} not implemented`;
  }

  @Get('my/transactions')
  async getMyTransactions() {
    return `${this.getMyTransactions.name} not implemented`;
  }

  @Get('/my/swaps')
  async getMySwaps() {
    return `${this.getMySwaps.name} not implemented`;
  }

  @Get('/:address')
  async getAddressInfo(@Param() dto: getAddressDto) {
    const { address } = dto;
    return `${address}, ${this.getAddressInfo.name} not implemented`;
  }

  @Get('/:address/swaps')
  async getAddressSwaps(@Param() dto: getAddressDto) {
    const { address } = dto;
    return `${address}, ${this.getAddressSwaps.name} not implemented`;
  }

  @Get('/:address/transactions')
  async getAddressTransactions(@Param() dto: getAddressDto) {
    const { address } = dto;
    return `${address}, ${this.getAddressTransactions.name} not implemented`;
  }
}
