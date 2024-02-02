import {
  AccessTokenPayload,
  User,
  UserRoleId,
} from '@project/libs/shared-types';

export const createJWTPayload = (
  user: Pick<User, 'id' | 'firstname' | 'lastname' | 'email'> & {
    roleId: UserRoleId;
  }
): AccessTokenPayload => ({
  sub: user.id,
  email: user.email,
  roleId: user.roleId,
  lastname: user.lastname,
  firstname: user.firstname,
});
