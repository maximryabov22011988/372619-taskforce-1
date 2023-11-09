import {
  AvailableCity,
  Category,
  DateString,
  Tag,
  Task,
  TaskStatus,
} from '@project/libs/shared-types';

export class TaskEntity implements Task {
  public id?: string;
  public title: string;
  public description: string;
  public category: Category;
  public city: AvailableCity;
  public price: number;
  public executionDate: DateString;
  public image: string;
  public address: string;
  public tags: Tag[];
  public status: TaskStatus;
  public contractorId: string;
  public customerId: string;
  public createdAt: DateString;

  constructor(task: Task) {
    this.fillEntity(task);
  }

  public toObject() {
    return { ...this };
  }

  private fillEntity(task: Task) {
    Object.assign(this, task);
  }
}
