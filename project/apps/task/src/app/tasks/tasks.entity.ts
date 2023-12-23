import { Tag, Task, Entity, Uuid } from '@project/libs/shared-types';

export class TaskEntity
  implements Entity<TaskEntity>, Omit<Task, 'category' | 'city' | 'status'>
{
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
  public tags: Tag[];
  public contractorId: Uuid;
  public customerId: Uuid;

  constructor(task: Task) {
    this.fillEntity(task);
  }

  public toObject(): TaskEntity {
    return { ...this };
  }

  public fillEntity(task: Task) {
    Object.assign(this, task);
  }
}
