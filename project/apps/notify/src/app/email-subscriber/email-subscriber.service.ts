import { Injectable } from '@nestjs/common';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { EmailSubscriberRepository } from './email-subscriber.repository';

@Injectable()
export class EmailSubscriberService {
  constructor(
    private readonly emailSubscriberRepository: EmailSubscriberRepository
  ) {}

  public async addSubscriber(subscriber: CreateSubscriberDto) {
    const { email } = subscriber;
    const existedSubscriber = await this.emailSubscriberRepository.findByEmail(
      email
    );

    if (existedSubscriber) {
      return existedSubscriber;
    }

    return this.emailSubscriberRepository.create(subscriber);
  }
}
