import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { AuthService } from 'auth/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }

  private validateRequest(request: Request) {
    if (!request.headers.authorization) {
      throw new BadRequestException('Invalid Authorization Header');
    }
    const jwtString = request.headers.authorization.split('Bearer ')[1]; // nullish coalescing 하지 않으면 empty header가 왔을때 서버에러가 난다.
    // const { userId } = this.authService.verify(jwtString);
    // request['authUserId'] = userId; // 가드 안에서 req 객체에 값을 추가할 수 있다.
    return true;
  }
}
