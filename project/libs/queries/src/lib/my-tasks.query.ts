import { IsOptional, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';
import { transform } from '@project/libs/utils-core';
import { TaskStatusId } from '@project/libs/shared-types';

export class MyTaskQuery {
  @Transform(transform.numericStringToNumber)
  @IsOptional()
  @IsEnum(TaskStatusId)
  public statusId: TaskStatusId;
}
