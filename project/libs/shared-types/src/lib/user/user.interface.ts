import { Uuid } from '../shared';
import { UserRole } from './user-role.enum';

export type Email = string;
export type Password = string;
export type ImageUrl = string;

export interface BaseUser {
  id?: Uuid;
  firstname: string;
  lastname: string;
  registrationDate?: string;
  cityId: number;
  role: UserRole;
  email: Email;
  info?: string;
}
