import { Controller } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { RabbitRouting } from '@project/libs/shared-types';
import { DateTimeService } from '@project/libs/services';
import { CreateNewTasksNotificationDto } from '@project/libs/dto';
import { MailService } from '../mail/mail.service';
import { EmailSubscriberService } from './email-subscriber.service';

@Controller()
export class EmailSubscriberController {
  constructor(
    private readonly emailSubscriberService: EmailSubscriberService,
    private readonly mailService: MailService,
    private readonly dateTimeService: DateTimeService
  ) {}

  @RabbitSubscribe({
    exchange: process.env.NOTIFY_RABBITMQ_EXCHANGE,
    routingKey: RabbitRouting.AddNewTasksSelection,
    queue: process.env.NOTIFY_RABBITMQ_QUEUE,
  })
  public async create(dto: CreateNewTasksNotificationDto): Promise<void> {
    const { emails, tasks } = dto;

    const lastTaskNotificationDate =
      await this.emailSubscriberService.getLastTaskNotificationDate();
    let newTasksAfterLastNotificationDate = tasks;
    if (lastTaskNotificationDate) {
      newTasksAfterLastNotificationDate = tasks.filter((task) =>
        this.dateTimeService.isDateAfter(
          lastTaskNotificationDate,
          task.createdAt
        )
      );
    }

    const newTasksNotification = {
      emails,
      tasks: newTasksAfterLastNotificationDate,
    };

    this.emailSubscriberService.addNewTasksSelection(newTasksNotification);
    this.mailService.sendNewTasks(newTasksNotification);
  }
}
