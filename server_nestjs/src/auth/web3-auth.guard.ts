import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { MyCacheService } from '../cache/cache.service';

@Injectable()
export class Web3AuthGuard implements CanActivate {
  constructor(private myCacheService: MyCacheService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }

  private async validateRequest(request: Request) {
    if (!request.cookies.sessionId) {
      throw new UnauthorizedException('No SessionId included');
    }
    const sessionId = request.cookies.sessionId;
    const verifiedAddress = await this.myCacheService.get(sessionId);

    if (!verifiedAddress) {
      throw new UnauthorizedException('No such key in sessionDB');
    }
    request['user'] = { verifiedAddress };
    return true;
  }
}
