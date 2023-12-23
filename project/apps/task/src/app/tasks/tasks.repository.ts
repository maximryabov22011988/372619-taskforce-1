import { Inject, Injectable } from '@nestjs/common';
import { CRUDRepository } from '@project/libs/utils-types';
import { ITaskModel, TaskModel } from '../../database/models/task.model';
import { TaskEntity } from './tasks.entity';

@Injectable()
export class TasksRepository
  implements CRUDRepository<TaskEntity, number, ITaskModel>
{
  constructor(
    @Inject(TaskModel) private readonly taskModel: typeof TaskModel
  ) {}

  public async findAll(): Promise<ITaskModel[]> {
    return this.taskModel
      .query()
      .withGraphFetched('tags')
      .withGraphFetched('city')
      .withGraphFetched('status')
      .withGraphFetched('category')
      .returning('*')
      .castTo<ITaskModel[]>();
  }

  public async findById(id: number): Promise<ITaskModel> {
    return this.taskModel
      .query()
      .where({ id })
      .withGraphFetched('tags')
      .withGraphFetched('city')
      .withGraphFetched('status')
      .withGraphFetched('category')
      .returning('*')
      .first()
      .castTo<ITaskModel>();
  }

  public async create(item: TaskEntity): Promise<ITaskModel> {
    return this.taskModel
      .query()
      .insert(item.toObject())
      .withGraphFetched('tags')
      .withGraphFetched('city')
      .withGraphFetched('status')
      .withGraphFetched('category')
      .returning('*')
      .castTo<ITaskModel>();
  }

  public async update(id: number, item: TaskEntity): Promise<ITaskModel> {
    return this.taskModel
      .query()
      .patchAndFetchById(id, item.toObject())
      .withGraphFetched('tags')
      .withGraphFetched('city')
      .withGraphFetched('status')
      .withGraphFetched('category')
      .returning('*')
      .castTo<ITaskModel>();
  }

  public async delete(id: number): Promise<void> {
    await this.taskModel.query().where({ id }).delete();
  }
}
