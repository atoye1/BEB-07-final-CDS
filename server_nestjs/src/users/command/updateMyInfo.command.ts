import { ICommand } from '@nestjs/cqrs';

export class UpdateMyInfoCommand implements ICommand {
  constructor(
    readonly nickname: string,
    readonly email: string,
    readonly address: string,
  ) {}
}
