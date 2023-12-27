import { Tag, Entity, Uuid } from '@project/libs/shared-types';
import { TaskModelProperties } from '../../database/models/task.model';

export class TaskEntity implements Entity<TaskEntity> {
  public id?: number;
  public title: string;
  public description: string;
  public price: number;
  public executionDate: string;
  public imageUrl: string;
  public address: string;
  public categoryId: number;
  public cityId: number;
  public statusId: number;
  public contractorId: Uuid;
  public customerId: Uuid;

  constructor(task: TaskModelProperties) {
    this.fillEntity(task);
  }

  public toObject(): TaskEntity {
    return { ...this };
  }

  public fillEntity(task: TaskModelProperties) {
    Object.assign(this, task);
  }
}
