import { Transform } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';
import { transform } from '@project/libs/utils-core';

export class CommentQuery {
  public static readonly DEFAULT_LIMIT = 50;

  @Transform(transform.numericStringToNumber)
  @IsOptional()
  @IsInt()
  @Min(1)
  public page: number;

  @Transform(transform.numericStringToNumber)
  @IsOptional()
  @IsInt()
  public limit = CommentQuery.DEFAULT_LIMIT;
}
