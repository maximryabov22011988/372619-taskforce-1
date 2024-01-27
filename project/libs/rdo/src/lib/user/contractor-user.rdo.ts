import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { BaseUserRdo } from './base-user.rdo';

export class ContractorUserRdo extends BaseUserRdo {
  @ApiProperty({
    description: "User's city id",
    example: 1,
  })
  @Expose()
  public cityId: number;

  @ApiProperty({
    description: "User's age",
    example: 30,
  })
  @Expose()
  public age: number;

  @ApiProperty({
    description: 'User specialization list',
    example: ['frontend', 'backend'],
    isArray: true,
    type: String,
  })
  @Expose()
  @Transform(({ obj }) => obj.specializations.map(({ name }) => name))
  public specializations: string[];
}
