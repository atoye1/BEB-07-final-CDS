import {
  Controller,
  Req,
  Get,
  Post,
  Body,
  Param,
  Inject,
  Logger,
  LoggerService,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { UpdateUserDto } from './dto/update-user.dto';
import { getAddressDto } from './dto/get-address.dto';
import { Web3AuthGuard } from '../auth/web3-auth.guard';
import { Request } from 'express';
import { UpdateMyInfoCommand } from './commands/updateMyInfo.command';

import {
  GetAllUserQuery,
  GetUserInfoQuery,
  GetUserSwapsQuery,
  GetUserTransactionsQuery,
} from './queries';
import { VerifiedAddress } from './verified-address.decorator';

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

  @UseGuards(Web3AuthGuard)
  @Post('/my')
  async updateMyInfo(
    @Req() req: Request & { user: { verifiedAddress: string } },
    @Body() dto: UpdateUserDto,
  ) {
    const { verifiedAddress } = req.user;
    const { nickname, email } = dto;
    return await this.commandBus.execute(
      new UpdateMyInfoCommand(nickname, email, verifiedAddress),
    );
  }

  @UseGuards(Web3AuthGuard)
  @Get('/my')
  async getMyInfo(@VerifiedAddress() verifiedAddress: string) {
    return await this.queryBus.execute(new GetUserInfoQuery(verifiedAddress));
  }

  @UseGuards(Web3AuthGuard)
  @Get('my/transactions')
  async getMyTransactions(@VerifiedAddress() verifiedAddress: string) {
    return await this.queryBus.execute(
      new GetUserTransactionsQuery(verifiedAddress),
    );
  }

  @UseGuards(Web3AuthGuard)
  @Get('/my/swaps')
  async getMySwaps(@VerifiedAddress() verifiedAddress: string) {
    return await this.queryBus.execute(new GetUserSwapsQuery(verifiedAddress));
  }

  @Get('/:address')
  async getAddressInfo(@Param() dto: getAddressDto) {
    const { address } = dto;
    return await this.queryBus.execute(new GetUserInfoQuery(address));
  }

  @Get('/:address/swaps')
  async getAddressSwaps(@Param() dto: getAddressDto) {
    const { address } = dto;
    return await this.queryBus.execute(new GetUserSwapsQuery(address));
  }

  @Get('/:address/transactions')
  async getAddressTransactions(@Param() dto: getAddressDto) {
    const { address } = dto;
    return await this.queryBus.execute(new GetUserTransactionsQuery(address));
  }
}
