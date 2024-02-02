import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsPositive,
  IsNotEmpty,
  IsInt,
  Min,
  Max,
  Length,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { ReviewRule } from './validation-rules';

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

  @ApiProperty({
    description: "Task's customer id",
    example: 'fbc55fd6-9ac2-4aad-8b79-5adfb2faed8d',
  })
  @IsOptional()
  @IsString()
  @IsUUID(4)
  public customerId: string;

  @ApiProperty({
    description: "Task's contractor id",
    example: 'fbc55fd6-9ac2-4aad-8b79-5adfb2faed8d',
  })
  @IsOptional()
  @IsString()
  @IsUUID(4)
  public contractorId: string;
}
