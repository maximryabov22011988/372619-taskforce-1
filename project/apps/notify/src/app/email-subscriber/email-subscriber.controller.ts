import { Controller } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { RabbitRouting } from '@project/libs/shared-types';
import { MailService } from '../mail/mail.service';
import { EmailSubscriberService } from './email-subscriber.service';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';

@Controller()
export class EmailSubscriberController {
  constructor(
    private readonly emailSubscriberService: EmailSubscriberService,
    private readonly mailService: MailService
  ) {}

  @RabbitSubscribe({
    exchange: 'taskforce.notify',
    routingKey: RabbitRouting.AddSubscriber,
    queue: 'taskforce.notify',
  })
  public async create(subscriber: CreateSubscriberDto): Promise<void> {
    this.emailSubscriberService.addSubscriber(subscriber);
    this.mailService.sendNotifyNewSubscriber(subscriber);
  }
}
