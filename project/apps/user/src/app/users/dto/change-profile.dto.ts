import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ChangeProfileDto {
  @ApiProperty({
    description: "User's first name",
    example: 'John',
  })
  public firstname?: string;

  @ApiProperty({
    description: "User's last name",
    example: 'Doe',
  })
  public lastname?: string;

  @ApiProperty({
    description: "User's birth date",
    example: '1977-11-11T08:55:00.000Z',
  })
  public birthDate?: string;

  @ApiProperty({
    description: 'Extended profile information',
    example: 'Some text',
  })
  public info?: string;

  @ApiProperty({
    description: "User's city id",
    example: 1,
  })
  @Expose()
  public cityId?: number;
}
