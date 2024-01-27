import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { BaseUserRdo } from '@project/libs/rdo';

export class ContractorUserRdo extends BaseUserRdo {
  @ApiProperty({
    description: "User's city",
    example: 'Москва',
  })
  @Expose()
  public city: string;

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
