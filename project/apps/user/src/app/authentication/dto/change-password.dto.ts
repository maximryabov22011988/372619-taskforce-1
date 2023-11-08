import { Password } from '@project/libs/shared-types';

export class ChangePasswordDto {
  public oldPassword: Password;

  public newPassword: Password;
}
