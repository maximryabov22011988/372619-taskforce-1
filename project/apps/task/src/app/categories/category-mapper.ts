import { fillObject } from '@project/libs/utils-core';
import { Category } from '@project/libs/shared-types';
import { RoleRdo } from '@project/libs/rdo';
import { CategoryModel } from '../../database/models/category.model';

export const mapToCategory = (category: CategoryModel): Category =>
  fillObject(RoleRdo, category);
