import { ApiProperty } from '@nestjs/swagger';
import { AvailableCity, UserRole } from '@project/libs/shared-types';

export class RegisterUserDto {
  @ApiProperty({
    description: "User's first name",
    example: 'John',
  })
  public firstname: string;

  @ApiProperty({
    description: "User's last name",
    example: 'Doe',
  })
  public lastname: string;

  @ApiProperty({
    description: "User's unique email address",
    example: 'john.doe@yahoo.com',
  })
  public email: string;

  @ApiProperty({
    description: "User's city",
    enum: AvailableCity,
    example: AvailableCity.Moscow,
  })
  public city: AvailableCity;

  @ApiProperty({
    description: "User's role",
    enum: UserRole,
    example: UserRole.Customer,
  })
  public role: UserRole;

  @ApiProperty({
    description: "User's password",
    example: '123456',
  })
  public password: string;

  @ApiProperty({
    description: "User's birthdate",
    example: '1977-11-11T08:55:00.000Z',
  })
  public birthDate: string;

  @ApiProperty({
    description: "User's avatar",
    example: '/api/static/avatar.png',
    required: false,
  })
  public avatarUrl?: string;
}
