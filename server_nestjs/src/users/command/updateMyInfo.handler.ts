import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UpdateMyInfoCommand } from './updateMyInfo.command';
import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'users/entities/users.entity';

@Injectable()
@CommandHandler(UpdateMyInfoCommand)
export class UpdateMyInfoHandler
  implements ICommandHandler<UpdateMyInfoCommand>
{
  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
  ) {}

  async execute(command: UpdateMyInfoCommand): Promise<any> {
    const { nickname, email, address } = command;
    const user = await this.userRepository.findOne({ where: { address } });
    if (!user) throw new UnprocessableEntityException(`${address} not Exists!`);

    user.nickname = nickname;
    user.email = email;
    await this.userRepository.save(user);

    // if (saveResult) await this.sendMemberJoinEmail(email, signupVerifyToken);

    // this.eventBus.publish(new UserCreatedEvent(email, signupVerifyToken));
    // this.eventBus.publish(new TestEvent());
  }

  private async checkUserExist(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    return user;
  }
}
