import { fillObject } from '@project/libs/utils-core';
import { Role } from '@project/libs/shared-types';
import { RoleRdo } from '@project/libs/rdo';
import { RoleModel } from '../../database/models/role.model';

export const mapToRole = (comment: RoleModel): Role =>
  fillObject(RoleRdo, comment);
