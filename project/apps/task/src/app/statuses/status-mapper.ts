import { fillObject } from '@project/libs/utils-core';
import { Status } from '@project/libs/shared-types';
import { StatusRdo } from '@project/libs/rdo';
import { StatusModel } from '../../database/models/status.model';

export const mapToStatus = (status: StatusModel): Status =>
  fillObject(StatusRdo, status);
