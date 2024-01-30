import { ApiProperty } from '@nestjs/swagger';
import { AvailableCityId } from '@project/libs/shared-types';
import {
  IsDateString,
  IsEmail,
  IsISO8601,
  IsString,
  Length,
  IsNotEmpty,
  IsEnum,
} from 'class-validator';
import { MinimumValidAge } from '@project/libs/validators';
import { UserRule, PasswordRule } from './validation-rules';

export class BaseUserDto {
  @ApiProperty({
    description: "User's first name",
    example: 'John',
  })
  @IsNotEmpty()
  @IsString()
  @Length(UserRule.NameMinLength, UserRule.NameMaxLength)
  public firstname: string;

  @ApiProperty({
    description: "User's last name",
    example: 'Doe',
  })
  @IsNotEmpty()
  @IsString()
  @Length(UserRule.NameMinLength, UserRule.NameMaxLength)
  public lastname: string;

  @ApiProperty({
    description: "User's birth date",
    example: '2000-11-11',
  })
  @IsNotEmpty()
  @IsDateString({ strict: true })
  @IsISO8601({ strict: true }, { message: 'The user date birth is not valid' })
  @MinimumValidAge(UserRule.MinAge)
  public birthDate: string;

  @ApiProperty({
    description: "User's city id",
    enum: AvailableCityId,
    example: 1,
  })
  @IsNotEmpty()
  @IsEnum(AvailableCityId)
  public cityId: AvailableCityId;

  @ApiProperty({
    description: "User's unique email address",
    example: 'john.doe@yahoo.com',
  })
  @IsNotEmpty()
  @IsEmail()
  public email: string;

  @ApiProperty({
    description: "User's password",
    example: '123456',
  })
  @IsNotEmpty()
  @IsString()
  @Length(PasswordRule.MinLength, PasswordRule.MaxLength)
  public password: string;
}
