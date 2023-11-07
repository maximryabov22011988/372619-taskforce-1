import {
  AvailableCity,
  UserRole,
  Email,
  Password,
  DateString,
  ImageUrl,
} from '@project/libs/shared-types';

export class RegisterUserDto {
  public firstname: string;

  public lastname: string;

  public email: Email;

  public city: AvailableCity;

  public role: UserRole;

  public password: Password;

  public birthDate: DateString;

  public avatar?: ImageUrl;
}
