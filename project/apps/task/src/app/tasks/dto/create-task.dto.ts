import {
  AvailableCity,
  Tag,
  Category,
  DateString,
} from '@project/libs/shared-types';

export class CreateTaskDto {
  public title: string;

  public description: string;

  public category: Category;

  public city: AvailableCity;

  public price?: number;

  public executionDate?: DateString;

  public image?: string;

  public address?: string;

  public tags?: Tag[];
}
