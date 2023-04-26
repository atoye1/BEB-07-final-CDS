import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MyCacheModule } from '../cache/cache.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../entities';
import { Web3AuthGuard } from './web3-auth.guard';

@Module({
  imports: [MyCacheModule, TypeOrmModule.forFeature([Users])],
  controllers: [AuthController],
  providers: [AuthService, Web3AuthGuard],
})
export class AuthModule {}
