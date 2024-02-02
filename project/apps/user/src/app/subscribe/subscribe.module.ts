import { Module } from '@nestjs/common';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { getRabbitMqOptions } from '@project/libs/utils-core';
import { UsersModule } from '../users/users.module';
import { SubscribeService } from './subscribe.service';

@Module({
  imports: [
    RabbitMQModule.forRootAsync(RabbitMQModule, getRabbitMqOptions()),
    UsersModule,
  ],
  providers: [SubscribeService],
  exports: [SubscribeService],
})
export class SubscribeModule {}
