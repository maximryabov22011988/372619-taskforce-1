import { User } from './user.interface';

export interface Customer
  extends Pick<
    User,
    'id' | 'firstname' | 'lastname' | 'createdAt' | 'city' | 'role' | 'email'
  > {
  info: string;
  publishedTasksCount: number;
  newTasksCount: number;
}
