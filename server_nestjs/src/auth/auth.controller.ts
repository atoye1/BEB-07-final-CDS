import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Req,
  Res,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { GetNonceDto } from './dto/get-nonce.dto';
import { Web3AuthGuard } from './web3-auth.guard';
import * as uuid from 'uuid';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const { address, signature } = loginDto;
    const sessionId = uuid.v1();
    const verifiedAddress = await this.authService.getVerifiedAddress(
      address,
      signature,
    );
    await this.authService.setSessionId(sessionId, verifiedAddress);
    await this.authService.createUser(verifiedAddress);
    res.cookie('sessionId', sessionId, { httpOnly: true });
    console.log('login successful', verifiedAddress, sessionId);
    return res.json({ verifiedAddress });
  }

  @Get('/nonce')
  getNonce(@Query() getNonceDto: GetNonceDto) {
    const { address } = getNonceDto;
    return this.authService.getNonce(address);
  }

  @UseGuards(Web3AuthGuard)
  @Get('/logout')
  logout(@Req() req: Request, @Res() res: Response) {
    const { sessionId } = req.cookies;
    this.authService.delSessionId(sessionId);
    res.clearCookie('sessionId');
    return res.json();
  }

  @UseGuards(Web3AuthGuard)
  @Get('/verify')
  verify(@Res() res: Response) {
    return res.status(200).json('Login Verfied');
  }
}
