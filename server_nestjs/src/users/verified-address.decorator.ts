import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const VerifiedAddress = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const verifiedAddress = request?.user?.verifiedAddress;

    if (verifiedAddress === null || verifiedAddress === undefined) {
      throw new Error('Verified address is missing.');
    }

    return verifiedAddress;
  },
);
