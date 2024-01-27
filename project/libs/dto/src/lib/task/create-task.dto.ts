import { ApiProperty } from '@nestjs/swagger';
import {
  IsISO8601,
  IsString,
  IsOptional,
  IsArray,
  IsNumber,
  IsDateString,
  IsNotEmpty,
  Min,
  Length,
  ArrayMaxSize,
} from 'class-validator';
import { AvailableCityId } from '@project/libs/shared-types';
import { IsSameOrAfterToday } from '@project/libs/validators';
import { TaskValidationRule } from './validation-rules';

export class CreateTaskDto {
  @ApiProperty({
    description: "Task's title",
    example: 'Todo title',
  })
  @IsNotEmpty()
  @IsString()
  @Length(TaskValidationRule.TitleMinLength, TaskValidationRule.TitleMaxLength)
  public title: string;

  @ApiProperty({
    description: 'Extended description',
    example: 'Details about task',
  })
  @IsNotEmpty()
  @IsString()
  @Length(
    TaskValidationRule.DescriptionMinLength,
    TaskValidationRule.DescriptionMaxLength
  )
  public description: string;

  @ApiProperty({
    description: 'New or existing category',
    example: 'engineering',
  })
  @IsNotEmpty()
  @IsString()
  public category: string;

  @ApiProperty({
    description: "User's city id",
    enum: AvailableCityId,
    example: AvailableCityId.Moscow,
  })
  @IsNotEmpty()
  public cityId: AvailableCityId;

  @ApiProperty({
    description: 'Service price',
    example: 1000,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  public price?: number;

  @ApiProperty({
    description: 'Date of completion task',
    example: '2023-12-25',
  })
  @IsOptional()
  @IsDateString({ strict: true })
  @IsISO8601({ strict: true }, { message: 'Execution date is not valid' })
  @IsSameOrAfterToday()
  public executionDate?: string;

  @ApiProperty({
    description: 'Picture',
    example:
      '/api/static/specification-1a9f2b32-7f87-490c-9c56-0c4a78b89791.jpg',
  })
  @IsOptional()
  @IsString()
  public imageUrl?: string;

  @ApiProperty({
    description: 'The address where the task should be performed',
    example: 'Moscow, Presnenskaya embankment, 12, office No. 2',
  })
  @IsOptional()
  @Length(
    TaskValidationRule.AddressMinLength,
    TaskValidationRule.AddressMaxLength
  )
  public address?: string;

  @ApiProperty({
    description: 'Tags for the task',
    example: ['engineering', 'moscow'],
    isArray: true,
    type: String,
  })
  @IsOptional()
  @ArrayMaxSize(5)
  @IsArray()
  @IsString({ each: true })
  @Length(TaskValidationRule.TagMinLength, TaskValidationRule.TagMaxLength, {
    each: true,
  })
  public tags?: string[];
}
