import { Controller } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { RabbitRouting } from '@project/libs/shared-types';
import { CreateNewTasksNotificationDto } from '@project/libs/dto';
import { MailService } from '../mail/mail.service';
import { EmailSubscriberService } from './email-subscriber.service';

@Controller()
export class EmailSubscriberController {
  constructor(
    private readonly emailSubscriberService: EmailSubscriberService,
    private readonly mailService: MailService
  ) {}

  @RabbitSubscribe({
    exchange: process.env.NOTIFY_RABBITMQ_EXCHANGE,
    routingKey: RabbitRouting.AddNewTasksSelection,
    queue: process.env.NOTIFY_RABBITMQ_QUEUE,
  })
  public async create(dto: CreateNewTasksNotificationDto): Promise<void> {
    const newTasksSelection =
      await this.emailSubscriberService.getNewTasksSelection(dto);
    this.emailSubscriberService.addNewTasksSelection(newTasksSelection);
    this.mailService.sendNewTasks(newTasksSelection);
  }
}
