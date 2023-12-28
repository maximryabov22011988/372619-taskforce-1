import { User } from './user.interface';

export type Customer = Pick<
  User,
  | 'id'
  | 'firstname'
  | 'lastname'
  | 'createdAt'
  | 'cityId'
  | 'email'
  | 'info'
  | 'role'
>;
