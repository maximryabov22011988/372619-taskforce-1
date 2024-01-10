import { Module } from '@nestjs/common';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { getRabbitMqOptions } from '@project/libs/utils-core';
import { NotifyService } from './notify.service';

@Module({
  imports: [RabbitMQModule.forRootAsync(RabbitMQModule, getRabbitMqOptions())],
  providers: [NotifyService],
  exports: [NotifyService],
})
export class NotifyModule {}
