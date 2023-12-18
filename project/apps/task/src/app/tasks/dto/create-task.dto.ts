import { ApiProperty } from '@nestjs/swagger';
import { AvailableCity } from '@project/libs/shared-types';

export class CreateTaskDto {
  @ApiProperty({
    description: "Task's title",
    example: 'Todo title',
  })
  public title: string;

  @ApiProperty({
    description: 'Extended description',
    example: 'Details about task',
  })
  public description: string;

  @ApiProperty({
    description: 'One of existing category',
    example: 'Engineering',
  })
  public category: string;

  @ApiProperty({
    description: "User's city",
    enum: AvailableCity,
    example: AvailableCity.Moscow,
  })
  public city: AvailableCity;

  @ApiProperty({
    description: 'Service price',
    example: 1000,
  })
  public price?: number;

  @ApiProperty({
    description: 'Date of completion task',
    example: '2023-23-04T08:55:00.000Z',
  })
  public executionDate?: string;

  @ApiProperty({
    description: 'Picture',
    example: 'example.png',
  })
  public imageUrl?: string;

  @ApiProperty({
    description: 'The address where the task should be performed',
    example: 'Moscow, Presnenskaya embankment, 12, office No. 2',
  })
  public address?: string;

  @ApiProperty({
    description: 'Tags for the task',
    example: ['engineering', 'moscow'],
    isArray: true,
    type: String,
  })
  public tags?: string[];
}
