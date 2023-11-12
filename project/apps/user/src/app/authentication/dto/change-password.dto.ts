import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({
    description: 'Old password',
    example: '123456',
  })
  public oldPassword: string;

  @ApiProperty({
    description: 'New password',
    example: '456789',
  })
  public newPassword: string;
}
