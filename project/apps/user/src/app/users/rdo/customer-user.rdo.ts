import { Expose } from 'class-transformer';
import {
  AvailableCity,
  UserRole,
  Email,
  DateString,
} from '@project/libs/shared-types';

export class CustomerUserRdo {
  @Expose()
  public id: string;

  @Expose()
  public firstname: string;

  @Expose()
  public lastname: string;

  @Expose()
  public createdAt: DateString;

  @Expose()
  public city: AvailableCity;

  @Expose()
  public role: UserRole;

  @Expose()
  public email: Email;

  @Expose()
  public publishedTasksCount: number;

  @Expose()
  public newTasksCount: number;
}
