import { User } from './user.interface';

export type Specialization = string;

export type Contractor = Pick<
  User,
  | 'id'
  | 'firstname'
  | 'lastname'
  | 'createdAt'
  | 'cityId'
  | 'role'
  | 'email'
  | 'info'
> & {
  age: number;
  specializations: Specialization[];
  rating: number;
  ratingLevel: number;
};
