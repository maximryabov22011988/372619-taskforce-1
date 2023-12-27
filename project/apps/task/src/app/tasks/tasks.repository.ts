import { Inject, Injectable } from '@nestjs/common';
import { CRUDRepository } from '@project/libs/utils-types';
import { TaskModel } from '../../database/models/task.model';
import { TaskEntity } from './tasks.entity';

@Injectable()
export class TasksRepository
  implements CRUDRepository<TaskEntity, number, TaskModel>
{
  constructor(
    @Inject(TaskModel) private readonly taskModel: typeof TaskModel
  ) {}

  public async findAll(): Promise<TaskModel[]> {
    return this.taskModel
      .query()
      .withGraphFetched('tags')
      .withGraphFetched('city')
      .withGraphFetched('status')
      .withGraphFetched('category')
      .returning('*');
  }

  public async findById(id: number): Promise<TaskModel> {
    return this.taskModel
      .query()
      .where({ id })
      .withGraphFetched('tags')
      .withGraphFetched('city')
      .withGraphFetched('status')
      .withGraphFetched('category')
      .returning('*')
      .first();
  }

  public async create(item: TaskEntity): Promise<TaskModel> {
    return this.taskModel
      .query()
      .insert(item.toObject())
      .withGraphFetched('tags')
      .withGraphFetched('city')
      .withGraphFetched('status')
      .withGraphFetched('category')
      .returning('*');
  }

  public async update(id: number, item: TaskEntity): Promise<TaskModel> {
    return this.taskModel
      .query()
      .patchAndFetchById(id, item.toObject())
      .withGraphFetched('tags')
      .withGraphFetched('city')
      .withGraphFetched('status')
      .withGraphFetched('category')
      .returning('*');
  }

  public async delete(id: number): Promise<void> {
    await this.taskModel.query().where({ id }).delete();
  }
}
