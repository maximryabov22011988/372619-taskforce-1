import { BaseUser } from './user.interface';

export type Specialization = string;

export interface Contractor extends BaseUser {
  age: number;
  specializations: Specialization[];
  rating: number;
  ratingLevel: number;
}
