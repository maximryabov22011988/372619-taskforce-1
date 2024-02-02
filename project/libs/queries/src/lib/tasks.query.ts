import { IsInt, IsOptional, IsEnum, Min, IsPositive } from 'class-validator';
import { Transform } from 'class-transformer';
import { transform } from '@project/libs/utils-core';
import { TaskStatusId, AvailableCityId } from '@project/libs/shared-types';

export enum TaskSorting {
  CreatedAt = 'createdAt',
  Popular = 'popular',
  Discussing = 'discussing',
}

export class TaskQuery {
  public static readonly DEFAULT_LIMIT = 25;

  public static readonly DEFAULT_STATUS = TaskStatusId.New;

  public static readonly DEFAULT_SORT: TaskSorting = TaskSorting.CreatedAt;

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
  @IsEnum(TaskSorting)
  public sorting: TaskSorting = TaskQuery.DEFAULT_SORT;
}
