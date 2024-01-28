import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { v4 as makeUuid } from 'uuid';
import { TaskConfig } from '@project/libs/config';
import {
  ContractorsEmails,
  Task,
  RabbitRouting,
} from '@project/libs/shared-types';
import { CreateNewTasksNotificationDto } from '@project/libs/dto';

const { rabbitMqConfig } = TaskConfig;

const REQUEST_TIMEOUT_IN_MS = 5000;

@Injectable()
export class NotifyService {
  constructor(
    private readonly rabbitClient: AmqpConnection,

    @Inject(rabbitMqConfig.KEY)
    private readonly rabbitMqOptions: ConfigType<typeof rabbitMqConfig>
  ) {}

  public async notifyNewTasks(tasks: Task[]) {
    if (!tasks.length) {
      return;
    }

    const { emails } = await this.requestContractorsEmails();
    if (!emails.length) {
      return;
    }

    return this.rabbitClient.publish<CreateNewTasksNotificationDto>(
      this.rabbitMqOptions.exchange,
      RabbitRouting.AddNewTasksSelection,
      { emails, tasks }
    );
  }

  private async requestContractorsEmails(): Promise<ContractorsEmails> {
    return this.rabbitClient.request({
      correlationId: makeUuid(),
      exchange: this.rabbitMqOptions.exchange,
      routingKey: RabbitRouting.RequestContractorsEmails,
      timeout: REQUEST_TIMEOUT_IN_MS,
    });
  }
}
