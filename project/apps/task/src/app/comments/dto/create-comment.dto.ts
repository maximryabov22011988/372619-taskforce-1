import {
  IsString,
  IsPositive,
  IsNotEmpty,
  IsInt,
  Length,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CommentValidationRule } from '../comments.validation';

export class CreateCommentDto {
  @ApiProperty({
    description: 'Comment text',
    example: 'Some comment text',
  })
  @IsNotEmpty()
  @IsString()
  @Length(
    CommentValidationRule.TextMinLength,
    CommentValidationRule.TextMaxLength
  )
  public text: string;

  @ApiProperty({
    description: 'Task identifier',
    example: 1,
  })
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  public taskId: number;
}
