import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { TaskConfig } from '@project/libs/config';
import { RabbitRouting } from '@project/libs/shared-types';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';

const { rabbitMqConfig } = TaskConfig;

@Injectable()
export class NotifyService {
  constructor(
    private readonly rabbitClient: AmqpConnection,

    @Inject(rabbitMqConfig.KEY)
    private readonly rabbitMqOptions: ConfigType<typeof rabbitMqConfig>
  ) {}

  public async registerSubscriber(dto: CreateSubscriberDto) {
    return this.rabbitClient.publish<CreateSubscriberDto>(
      this.rabbitMqOptions.exchange,
      RabbitRouting.AddSubscriber,
      { ...dto }
    );
  }
}
