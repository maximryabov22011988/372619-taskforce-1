import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsPositive,
  IsNotEmpty,
  IsInt,
  Min,
  Max,
  Length,
} from 'class-validator';
import { ReviewRule } from '../reviews.validation';

export class CreateReviewDto {
  @ApiProperty({
    description: 'Review text',
    example: 'Some review text',
  })
  @IsNotEmpty()
  @IsString()
  @Length(ReviewRule.TextMinLength, ReviewRule.TextMaxLength)
  public text: string;

  @ApiProperty({
    description: 'Task identifier',
    example: 1,
  })
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  public taskId: number;

  @ApiProperty({
    description: 'Rating',
    example: 4,
  })
  @IsNotEmpty()
  @IsInt()
  @Min(ReviewRule.MinRating)
  @Max(ReviewRule.MaxRating)
  public rating: number;
}
