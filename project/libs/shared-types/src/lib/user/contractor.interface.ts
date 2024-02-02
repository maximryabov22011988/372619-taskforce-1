import { User } from './user.interface';

export type Specialization = string;

export interface Contractor extends User {
  age: number;
  specializations: Specialization[];
}
