import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { CreateNewTasksNotificationDto } from '@project/libs/dto';
import { dateTimeService } from '@project/libs/services';

const EMAIL_SUBJECT = `Подборка свежих заданий от ${dateTimeService.formatDate(
  new Date(),
  'DD.MM.YYYY'
)} г.`;

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  public async sendNewTasks({
    emails,
    tasks,
  }: CreateNewTasksNotificationDto): Promise<void> {
    emails.forEach((email) => {
      this.mailerService.sendMail({
        to: email,
        subject: EMAIL_SUBJECT,
        template: './new-tasks-selection',
        context: { tasks },
      });
    });
  }
}
