import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { getRabbitMqOptions } from '@project/libs/utils-core';
import { MailModule } from '../mail/mail.module';
import { EmailSubscriberController } from './email-subscriber.controller';
import { EmailSubscriberService } from './email-subscriber.service';
import {
  EmailSubscriberModel,
  EmailSubscriberSchema,
} from './email-subscriber.model';
import { EmailSubscriberRepository } from './email-subscriber.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EmailSubscriberModel.name, schema: EmailSubscriberSchema },
    ]),
    RabbitMQModule.forRootAsync(RabbitMQModule, getRabbitMqOptions()),
    MailModule,
  ],
  controllers: [EmailSubscriberController],
  providers: [
    EmailSubscriberService,
    EmailSubscriberRepository,
    EmailSubscriberController,
  ],
})
export class EmailSubscriberModule {}
