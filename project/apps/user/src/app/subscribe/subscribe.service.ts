import { Injectable } from '@nestjs/common';
import { RabbitRPC } from '@golevelup/nestjs-rabbitmq';
import {
  ContractorsEmails,
  RabbitRouting,
  UserRoleId,
} from '@project/libs/shared-types';
import { UsersService } from '../users/users.service';

@Injectable()
export class SubscribeService {
  constructor(private readonly usersService: UsersService) {}

  @RabbitRPC({
    exchange: process.env.USER_RABBITMQ_EXCHANGE,
    routingKey: RabbitRouting.RequestContractorsEmails,
    queue: process.env.USER_RABBITMQ_QUEUE,
  })
  public async getContractorsEmails(): Promise<ContractorsEmails> {
    const contractorModels = await this.usersService.findByRole(
      UserRoleId.Contractor
    );
    const emails = contractorModels.map(({ email }) => email);

    return { emails };
  }
}
