import { genSalt, hash, compare } from 'bcrypt';
import {
  AvailableCity,
  User,
  UserRole,
  Email,
  Password,
  DateString,
  ImageUrl,
  Specialization,
} from '@project/libs/shared-types';

const SALT_ROUNDS = 10;

export class UserEntity implements User {
  public id: string;
  public firstname: string;
  public lastname: string;
  public email: Email;
  public city: AvailableCity;
  public passwordHash: Password;
  public specialization: Specialization[];
  public role: UserRole;
  public birthDate: DateString;
  public createdAt: DateString;
  public info: string;
  public avatar?: ImageUrl;

  constructor(user: Omit<User, 'passwordHash'>) {
    this.fillEntity(user);
  }

  public toObject() {
    return { ...this };
  }

  public async setPassword(password: string): Promise<UserEntity> {
    const salt = await genSalt(SALT_ROUNDS);
    this.passwordHash = await hash(password, salt);
    return this;
  }

  public comparePassword(password: string): Promise<boolean> {
    return compare(password, this.passwordHash);
  }

  private fillEntity(user: Omit<User, 'passwordHash'>) {
    Object.assign(this, user);
  }
}
