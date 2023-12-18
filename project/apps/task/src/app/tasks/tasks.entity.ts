import {
  AvailableCity,
  Category,
  Tag,
  Task,
  TaskStatus,
  Entity,
} from '@project/libs/shared-types';

export class TaskEntity implements Entity<TaskEntity>, Task {
  public id?: number;
  public title: string;
  public description: string;
  public category: Category;
  public city: AvailableCity;
  public price: number;
  public executionDate: string;
  public imageUrl: string;
  public address: string;
  public tags: Tag[];
  public status: TaskStatus;
  public contractorId: string;
  public customerId: string;
  public createdAt: string;
  public updatedAt: string;

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
