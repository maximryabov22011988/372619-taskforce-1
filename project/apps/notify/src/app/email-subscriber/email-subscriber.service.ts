import { Injectable } from '@nestjs/common';
import { CreateNewTasksNotificationDto } from '@project/libs/dto';
import { DateTimeService } from '@project/libs/services';
import { TaskRdo } from '@project/libs/rdo';
import { EmailSubscriberRepository } from './email-subscriber.repository';

@Injectable()
export class EmailSubscriberService {
  constructor(
    private readonly emailSubscriberRepository: EmailSubscriberRepository,
    private readonly dateTimeService: DateTimeService
  ) {}

  public async addNewTasksSelection(
    newTasksSelection: CreateNewTasksNotificationDto
  ) {
    return this.emailSubscriberRepository.create(newTasksSelection);
  }

  public async getNewTasksSelection(
    dto: CreateNewTasksNotificationDto
  ): Promise<{ emails: string[]; tasks: TaskRdo[] }> {
    const { emails, tasks } = dto;

    const lastTaskNotificationDate = await this.getLastTaskNotificationDate();
    let newTasksAfterLastNotificationDate = tasks;
    if (lastTaskNotificationDate) {
      newTasksAfterLastNotificationDate = tasks.filter((task) =>
        this.dateTimeService.isDateAfter(
          lastTaskNotificationDate,
          task.createdAt
        )
      );
    }

    return {
      emails,
      tasks: newTasksAfterLastNotificationDate,
    };
  }

  private async getLastTaskNotificationDate() {
    const { createdAt } =
      (await this.emailSubscriberRepository.findLatest()) ?? {
        createdAt: null,
      };

    return createdAt;
  }
}
