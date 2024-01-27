import { fillObject } from '@project/libs/utils-core';
import { City } from '@project/libs/shared-types';
import { RoleRdo } from '@project/libs/rdo';
import { CityModel } from '../../database/models/city.model';

export const mapToCity = (comment: CityModel): City =>
  fillObject(RoleRdo, comment);
