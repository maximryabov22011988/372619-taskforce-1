import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { PasswordRule } from './validation-rules';

export class LoginUserDto {
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
