import { UserRoleId } from '../user/user-role.enum';
import { User } from '../user/user.interface';

export interface RequestWithUser {
  user?: Pick<User, 'id' | 'firstname' | 'lastname' | 'email'> & {
    roleId: UserRoleId;
  };
}
