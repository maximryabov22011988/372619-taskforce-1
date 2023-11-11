import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { AvailableCity, TaskStatus } from '@project/libs/shared-types';

export class TaskRdo {
  @ApiProperty({
    description: 'Unique identifier',
    example: '4ff6e921-36c4-4f80-ae41-919c06c0c5c3',
  })
  @Expose()
  public id?: string;

  @ApiProperty({
    description: "Task's title",
    example: 'Todo title',
  })
  @Expose()
  public title: string;

  @ApiProperty({
    description: 'Extended description',
    example: 'Details about task',
  })
  @Expose()
  public description: string;

  @ApiProperty({
    description: 'One of existing category',
    example: 'Engineering',
  })
  @Expose()
  public category: string;

  @ApiProperty({
    description: 'Service price',
    example: 1000,
  })
  @Expose()
  public price: number;

  @ApiProperty({
    description: 'Date of completion task',
    example: '2023-23-04T08:55:00.000Z',
  })
  @Expose()
  public executionDate: string;

  @ApiProperty({
    description: 'Picture',
    example: 'example.png',
  })
  @Expose()
  public image: string;

  @ApiProperty({
    description: 'The address where the task should be performed',
    example: 'Moscow, Presnenskaya embankment, 12, office No. 2',
  })
  @Expose()
  public address: string;

  @ApiProperty({
    description: 'Tags for the task',
    example: ['engineering', 'moscow'],
    isArray: true,
    type: String,
  })
  @Expose()
  public tags: string[];

  @ApiProperty({
    description: "User's city",
    enum: AvailableCity,
    example: AvailableCity.Moscow,
  })
  @Expose()
  public city: AvailableCity;

  @ApiProperty({
    description: "Task's status",
    enum: TaskStatus,
    example: TaskStatus.New,
  })
  @Expose()
  public status: TaskStatus;

  @ApiProperty({
    description: "Task's customer",
    example: '84tu5fd6-9ac2-4aad-8b79-5adfb2faed8d',
  })
  @Expose()
  public customerId: string;

  @ApiProperty({
    description: "Task's contractor",
    example: '432446g6-9ac2-4aad-8b79-5adfb2faed8d',
  })
  @Expose()
  public contractorId: string;
}
