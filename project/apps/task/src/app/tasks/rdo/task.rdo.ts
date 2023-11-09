import { Expose } from 'class-transformer';
import {
  AvailableCity,
  TaskStatus,
  DateString,
  Category,
  Tag,
} from '@project/libs/shared-types';

export class TaskRdo {
  @Expose()
  public id?: string;

  @Expose()
  public title: string;

  @Expose()
  public description: string;

  @Expose()
  public category: Category;

  @Expose()
  public price: number;

  @Expose()
  public executionDate: DateString;

  @Expose()
  public image: string;

  @Expose()
  public address: string;

  @Expose()
  public tags: Tag[];

  @Expose()
  public city: AvailableCity;

  @Expose()
  public status: TaskStatus;

  @Expose()
  public customerId: string;

  @Expose()
  public contractorId: string;
}
