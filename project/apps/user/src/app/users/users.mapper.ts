import assign from 'lodash/assign';
import { fillObject } from '@project/libs/utils-core';
import { Customer, Contractor, UserRole } from '@project/libs/shared-types';
import { UserModel } from '../../database/models/user.model';
import { CustomerUserRdo } from './rdo/customer-user.rdo';
import { ContractorUserRdo } from './rdo/contractor-user.rdo';

const roleToMapper: { [id in UserRole]: (userModel: UserModel) => any } = {
  [UserRole.Customer]: (userModel: UserModel): Customer =>
    fillObject(CustomerUserRdo, userModel),
  [UserRole.Contractor]: (userModel: UserModel): Contractor =>
    fillObject(ContractorUserRdo, userModel),
};

export const mapToUserByRole = (userModel: UserModel): Customer | Contractor =>
  roleToMapper[userModel.roleId];
