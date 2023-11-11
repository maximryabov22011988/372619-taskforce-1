import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({
    description: "User's unique email address",
    example: 'john.doe@yahoo.com',
  })
  public email: string;

  @ApiProperty({
    description: "User's password",
    example: '123456',
  })
  public password: string;
}
