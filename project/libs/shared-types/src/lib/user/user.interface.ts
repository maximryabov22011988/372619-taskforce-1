import { Specialization } from '../user/contractor.interface';
import { Uuid } from '../shared';
import { UserRole } from './user-role.enum';

export type Email = string;
export type Password = string;
export type ImageUrl = string;

export interface User {
  id?: Uuid;
  firstname: string;
  lastname: string;
  info?: string;
  email: Email;
  cityId: number;
  passwordHash: Password;
  specialization?: Specialization[];
  role: UserRole;
  birthDate: string;
  avatarUrl?: ImageUrl;
  createdAt?: number;
}
