import { Injectable } from '@nestjs/common';
import { Task } from '@project/libs/shared-types';
import { TaskEntity } from './tasks.entity';

import { MemoryRepository } from '@project/services';

@Injectable()
export class TasksRepository extends MemoryRepository<
  Omit<TaskEntity, 'toObject' | 'fillEntity'>,
  Task
> {
  public async findAll(): Promise<Task[]> {
    return Object.values(this.repository);
  }
}
