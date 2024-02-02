import {
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AccessTokenPayload, UserRoleId } from '@project/libs/shared-types';

const ROLES_IDS_METADATA_KEY = 'roles';

export const Roles = (...rolesIds: UserRoleId[]) =>
  SetMetadata(ROLES_IDS_METADATA_KEY, rolesIds);

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const roles: number[] = this.reflector.get(
      ROLES_IDS_METADATA_KEY,
      context.getHandler()
    );

    if (!roles || !roles?.length) {
      return true;
    }

    const accessTokenUser: AccessTokenPayload | null | undefined = request.user;
    if (!accessTokenUser) {
      return false;
    }

    return roles.includes(accessTokenUser.roleId);
  }
}
