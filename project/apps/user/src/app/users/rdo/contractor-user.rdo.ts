import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { BaseUserRdo } from './base-user.rdo';

export class ContractorUserRdo extends BaseUserRdo {
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
  })
  @Expose()
  public specializations: string[];

  @ApiProperty({
    description: "User's rating",
    example: 4,
  })
  @Expose()
  public rating: number;

  @ApiProperty({
    description: "User's rating level",
    example: 4.2,
  })
  @Expose()
  public ratingLevel: number;
}
