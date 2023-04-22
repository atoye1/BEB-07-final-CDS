import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { getAddressDto } from './dto/get-address.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAllUser() {
    return `${this.getAllUser.name} not implemented`;
  }

  @Post('/my')
  updateMyInfo(@Body() UpdateUserDto: UpdateUserDto) {
    return `${this.updateMyInfo.name} not implemented`;
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
