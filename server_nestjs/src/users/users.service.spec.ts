import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Web3AuthGuard } from '../auth/web3-auth.guard';
import { MyCacheService } from '../cache/cache.service';
import { MyCacheModule } from 'cache/cache.module';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MyCacheModule],
      providers: [UsersService, Web3AuthGuard, MyCacheService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
