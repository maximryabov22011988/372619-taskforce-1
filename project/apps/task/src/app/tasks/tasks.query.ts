import { IsInt, IsOptional, IsEnum, Min, IsPositive } from 'class-validator';
import { Transform } from 'class-transformer';
import { transform } from '@project/libs/utils-core';
import { TaskStatusId, AvailableCityId } from '@project/libs/shared-types';

export enum Sorting {
  CreatedAt = 'createdAt',
  Popular = 'popular',
  Discussing = 'discussing',
}

export const mapSortingToColumn = (sorting: Sorting) => {
  if (sorting === Sorting.Popular) {
    return 'responses';
  }

  if (sorting === Sorting.Discussing) {
    return 'commentsCount';
  }

  return 'createdAt';
};

export class TaskQuery {
  public static readonly DEFAULT_LIMIT = 25;

  public static readonly DEFAULT_STATUS = TaskStatusId.New;

  public static readonly DEFAULT_SORT: Sorting = Sorting.CreatedAt;

  @Transform(transform.numericStringToNumber)
  @IsOptional()
  @IsInt()
  @Min(1)
  public page: number;

  @Transform(transform.numericStringToNumber)
  @IsOptional()
  @IsInt()
  public limit = TaskQuery.DEFAULT_LIMIT;

  @Transform(transform.numericStringToNumber)
  @IsOptional()
  @IsInt()
  @IsPositive()
  public categoryId: number;

  @Transform(transform.numericStringToNumber)
  @IsOptional()
  @IsInt()
  @IsPositive()
  public tagId: string;

  @Transform(transform.numericStringToNumber)
  @IsOptional()
  @IsEnum(AvailableCityId)
  public cityId: AvailableCityId;

  @IsOptional()
  @IsEnum(Sorting)
  public sorting: Sorting = TaskQuery.DEFAULT_SORT;
}
