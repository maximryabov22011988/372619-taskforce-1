import { ApiProperty, PickType } from '@nestjs/swagger';
import { UserRoleId } from '@project/libs/shared-types';
import {
  IsOptional,
  IsString,
  IsNotEmpty,
  IsInt,
  IsPositive,
} from 'class-validator';
import { BaseUserDto } from './base-user.dto';

export class RegisterUserDto extends PickType(BaseUserDto, [
  'firstname',
  'lastname',
  'birthDate',
  'cityId',
  'email',
  'password',
] as const) {
  @ApiProperty({
    description: "User's role id",
    type: Number,
    example: UserRoleId.Customer,
  })
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  public roleId: UserRoleId;

  @ApiProperty({
    description: "User's avatar",
    example: '/api/static/avatar.png',
    required: false,
  })
  @IsOptional()
  @IsString()
  public avatarUrl?: string;
}
