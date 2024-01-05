import { ApiProperty } from '@nestjs/swagger';
import {
  IsISO8601,
  IsOptional,
  IsString,
  IsArray,
  IsDateString,
  IsEnum,
  Length,
  MaxLength,
} from 'class-validator';
import { MinimumValidAge } from '@project/validators';
import { AvailableCityId } from '@project/libs/shared-types';
import { UserRule } from '../users.validation';

export class ChangeProfileDto {
  @ApiProperty({
    description: "User's first name",
    example: 'John',
  })
  @IsOptional()
  @IsString()
  @Length(UserRule.NameMinLength, UserRule.NameMaxLength)
  public firstname: string;

  @ApiProperty({
    description: "User's last name",
    example: 'Doe',
  })
  @IsOptional()
  @IsString()
  @Length(UserRule.NameMinLength, UserRule.NameMaxLength)
  public lastname: string;

  @ApiProperty({
    description: "User's birth date",
    example: '1977-11-11',
  })
  @IsOptional()
  @IsDateString({ strict: true })
  @IsISO8601({ strict: true }, { message: 'The user date birth is not valid' })
  @MinimumValidAge(UserRule.MinAge)
  public birthDate: string;

  @ApiProperty({
    description: "User's city id",
    example: 1,
  })
  @IsOptional()
  @IsEnum(AvailableCityId)
  public cityId: AvailableCityId;

  @ApiProperty({
    description: 'Extended profile information',
    example: 'Some text',
  })
  @IsOptional()
  @IsString()
  @MaxLength(UserRule.DescriptionMaxLength)
  public info: string;

  @ApiProperty({
    description: 'User specialization list',
    example: ['frontend', 'backend'],
    isArray: true,
    type: String,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  public specializations: string[];
}
