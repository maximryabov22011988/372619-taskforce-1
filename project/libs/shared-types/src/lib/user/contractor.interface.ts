import { User } from './user.interface';

export type Specialization = string;

export interface Contractor
  extends Pick<
    User,
    'id' | 'firstname' | 'lastname' | 'createdAt' | 'city' | 'role' | 'email'
  > {
  info: string;
  age: number;
  specialization: Specialization[];
  completedTasksCount: number;
  failedTasksCount: number;
  rating: number;
  ratingLevel: number;
}
