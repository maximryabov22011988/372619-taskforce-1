import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { Subscriber } from '@project/libs/shared-types';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  public async sendNotifyNewSubscriber(subscriber: Subscriber): Promise<void> {
    await this.mailerService.sendMail({
      to: 'test-user@example.com',
      subject: 'Вы подписались на рассылку',
      template: './add-subscriber',
      context: {
        title: `${subscriber.title}`,
        description: `${subscriber.description}`,
        price: `${subscriber.price}`,
        city: `${subscriber.city}`,
      },
    });
  }
}
