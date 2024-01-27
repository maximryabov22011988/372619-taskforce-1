import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { AvailableCity } from '@project/libs/shared-types';

export class CityRdo {
  @ApiProperty({
    description: 'Unique identifier',
    example: 1,
  })
  @Expose()
  public id: number;

  @ApiProperty({
    description: 'City name',
    enum: AvailableCity,
    example: AvailableCity.Moscow,
  })
  @Expose()
  public name: string;
}
