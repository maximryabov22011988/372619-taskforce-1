import { Expose } from 'class-transformer';
import {
  AvailableCity,
  UserRole,
  Email,
  DateString,
  Specialization,
} from '@project/libs/shared-types';

export class ContractorUserRdo {
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
  public age: number;

  @Expose()
  public specialization: Specialization[];

  @Expose()
  public completedTasksCount: number;

  @Expose()
  public failedTasksCount: number;

  @Expose()
  public rating: number;

  @Expose()
  public ratingLevel: number;
}
