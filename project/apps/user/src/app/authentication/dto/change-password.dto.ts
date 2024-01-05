import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Length } from 'class-validator';
import { PasswordRule } from '../authentication.validation';

export class ChangePasswordDto {
  @ApiProperty({
    description: 'Old password',
    example: '123456',
  })
  @IsNotEmpty()
  @IsString()
  @Length(PasswordRule.MinLength, PasswordRule.MaxLength)
  public oldPassword: string;

  @ApiProperty({
    description: 'New password',
    example: '456789',
  })
  @IsNotEmpty()
  @IsString()
  @Length(PasswordRule.MinLength, PasswordRule.MaxLength)
  public newPassword: string;
}
