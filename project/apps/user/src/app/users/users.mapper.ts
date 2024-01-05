import assign from 'lodash/assign';
import { fillObject } from '@project/libs/utils-core';
import { Customer, Contractor, UserRoleId } from '@project/libs/shared-types';
import { UserModel } from '../../database/models/user.model';
import { CustomerUserRdo } from './rdo/customer-user.rdo';
import { ContractorUserRdo } from './rdo/contractor-user.rdo';
import { dateTimeService, DateTimeService } from '@project/services';

export const mapToUserByRole = (
  userModel: UserModel
): Customer | Contractor => {
  if (userModel.roleId === UserRoleId.Customer) {
    return fillObject(CustomerUserRdo, userModel);
  }

  if (userModel.roleId === UserRoleId.Contractor) {
    return fillObject(
      ContractorUserRdo,
      assign(userModel, {
        age: dateTimeService.getDiff(userModel.birthDate, 'year'),
        specializations: [],
      })
    );
  }
};
