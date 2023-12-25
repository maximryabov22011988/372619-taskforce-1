import { Inject, Injectable } from '@nestjs/common';
import { Task } from '@project/libs/shared-types';
import { CRUDRepository } from '@project/libs/utils-types';
import { TaskModel } from '../../database/models/task.model';
import { TaskEntity } from './tasks.entity';

@Injectable()
export class TasksRepository
  implements CRUDRepository<TaskEntity, number, Task>
{
  constructor(
    @Inject(TaskModel) private readonly taskModel: typeof TaskModel
  ) {}

  public async findAll(): Promise<Task[]> {
    return this.taskModel
      .query()
      .withGraphFetched('tags')
      .withGraphFetched('city')
      .withGraphFetched('status')
      .withGraphFetched('category')
      .returning('*')
      .castTo<Task[]>();
  }

  public async findById(id: number): Promise<Task> {
    return this.taskModel
      .query()
      .where({ id })
      .withGraphFetched('tags')
      .withGraphFetched('city')
      .withGraphFetched('status')
      .withGraphFetched('category')
      .returning('*')
      .first()
      .castTo<Task>();
  }

  public async create(item: TaskEntity): Promise<Task> {
    return this.taskModel
      .query()
      .insert(item.toObject())
      .withGraphFetched('tags')
      .withGraphFetched('city')
      .withGraphFetched('status')
      .withGraphFetched('category')
      .returning('*')
      .castTo<Task>();
  }

  public async update(id: number, item: TaskEntity): Promise<Task> {
    return this.taskModel
      .query()
      .patchAndFetchById(id, item.toObject())
      .withGraphFetched('tags')
      .withGraphFetched('city')
      .withGraphFetched('status')
      .withGraphFetched('category')
      .returning('*')
      .castTo<Task>();
  }

  public async delete(id: number): Promise<void> {
    await this.taskModel.query().where({ id }).delete();
  }
}
