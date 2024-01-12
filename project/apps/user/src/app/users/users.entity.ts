import { genSalt, hash, compare } from 'bcrypt';
import {
  Email,
  Password,
  ImageUrl,
  Specialization,
  Entity,
} from '@project/libs/shared-types';
import { UserModelProperties } from '../../database/models/user.model';

const SALT_ROUNDS = 10;

export class UserEntity implements Entity<UserEntity> {
  public id?: string;
  public firstname: string;
  public lastname: string;
  public email: Email;
  public cityId: number;
  public passwordHash: Password;
  public specializations: Specialization[];
  public roleId: number;
  public avatarUrl?: ImageUrl;
  public info: string;
  public birthDate: string;

  constructor(
    userData: UserModelProperties & { specializations: Specialization[] }
  ) {
    this.fillEntity(userData);
  }

  public toObject() {
    return { ...this };
  }

  public fillEntity(
    userData: UserModelProperties & { specializations: Specialization[] }
  ) {
    Object.assign(this, userData);
  }

  public async setPassword(password: string): Promise<UserEntity> {
    const salt = await genSalt(SALT_ROUNDS);
    this.passwordHash = await hash(password, salt);
    return this;
  }

  public comparePassword(password: string): Promise<boolean> {
    return compare(password, this.passwordHash);
  }
}
