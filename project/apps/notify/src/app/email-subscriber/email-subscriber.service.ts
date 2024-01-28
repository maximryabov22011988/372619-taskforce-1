import { Injectable } from '@nestjs/common';
import { CreateNewTasksNotificationDto } from '@project/libs/dto';
import { EmailSubscriberRepository } from './email-subscriber.repository';

@Injectable()
export class EmailSubscriberService {
  constructor(
    private readonly emailSubscriberRepository: EmailSubscriberRepository
  ) {}

  public async addNewTasksSelection(
    newTasksSelection: CreateNewTasksNotificationDto
  ) {
    return this.emailSubscriberRepository.create(newTasksSelection);
  }

  public async getLastTaskNotificationDate() {
    const { createdAt } = await this.emailSubscriberRepository.findLatest();
    return createdAt;
  }
}
