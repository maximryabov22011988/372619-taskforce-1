import { AvailableCity } from '../shared';
import { UserRole } from './user-role.enum';

export type Email = string;
export type Password = string;
export type ImageUrl = string;

export interface User {
  id?: string;
  firstname: string;
  lastname: string;
  email: Email;
  city: AvailableCity;
  passwordHash: Password;
  role: UserRole;
  birthDate: string;
  createdAt?: string;
  avatar?: ImageUrl;
}
