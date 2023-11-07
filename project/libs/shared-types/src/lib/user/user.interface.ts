import { UserRole } from './user-role.enum';
import { AvailableCity } from './available-city.enum';

export type Email = string;
export type Password = string;
export type DateString = string;
export type ImageUrl = string;

export interface User {
  id?: string;
  firstname: string;
  lastname: string;
  email: Email;
  city: AvailableCity;
  passwordHash: Password;
  role: UserRole;
  birthDate: DateString;
  createdAt?: DateString;
  avatar?: ImageUrl;
}
