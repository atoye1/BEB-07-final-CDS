import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as uuid from 'uuid';
import { recoverPersonalSignature } from 'eth-sig-util';
import { bufferToHex } from 'ethereumjs-util';

import { Users } from '../entities';
import { MyCacheService } from '../cache/cache.service';

@Injectable()
export class AuthService {
  constructor(
    private myCacheService: MyCacheService,
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
  ) {}

  async getVerifiedAddress(address: string, signature: string) {
    const result = await this.verifySignature(address, signature);
    if (!result) {
      throw new UnauthorizedException();
    }
    return result;
  }

  async getNonce(address: string) {
    const nonce = uuid.v1();
    await this.myCacheService.set(address, nonce, { ttl: 1000 * 60 });
    return { nonce };
  }

  async createUser(address: string) {
    const user = this.userRepository.findOne({ where: { address } });
    if (user) return;
    // TODO DB에서 유저를 조회하고, 저장된 유저가 없으면 새로 만든다.
    // TODO 새로 만드는 경우, faucet으로 이더와 토큰을 준다.
    return;
  }

  async verifySignature(address: string, signature: string) {
    const nonce = (await this.myCacheService.get(address)) as string;

    const parsedAddress = recoverPersonalSignature({
      data: bufferToHex(Buffer.from(`sign: ${nonce}`)),
      sig: signature,
    });

    if (parsedAddress.toLowerCase() !== address.toLowerCase()) return null;

    return parsedAddress.toLowerCase();
  }

  async setSessionId(sessionId: string, verifiedAddress: string) {
    await this.myCacheService.set(sessionId, verifiedAddress);
    console.log(await this.myCacheService.get(sessionId));
  }

  async delSessionId(sessionId: string) {
    await this.myCacheService.del(sessionId);
  }
}
