import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import parseInt from 'lodash/parseInt';
import { AvailableCity, TaskStatus } from '@project/libs/shared-types';
import { dateTimeService } from '@project/services';

export class TaskRdo {
  @ApiProperty({
    description: 'Unique identifier',
    example: 1,
  })
  @Expose()
  public id: number;

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
  @Transform(({ obj }) => obj.category.name)
  public category: string;

  @ApiProperty({
    description: 'Service price',
    example: 1000,
  })
  @Expose()
  public price: number;

  @ApiProperty({
    description: 'Date of completion task',
    example: '2023-12-25T00:00:00.000Z',
  })
  @Expose()
  @Transform(({ obj }) => dateTimeService.formatDate(obj.executionDate))
  public executionDate: string;

  @ApiProperty({
    description: 'Picture',
    example: '/api/static/example-1a9f2b32-7f87-490c-9c56-0c4a78b89791.jpg',
  })
  @Expose()
  public imageUrl: string;

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
  @Transform(({ obj }) => obj.tags.map(({ name }) => name))
  public tags: string[];

  @ApiProperty({
    description: "User's city",
    enum: AvailableCity,
    example: AvailableCity.Moscow,
  })
  @Expose()
  @Transform(({ obj }) => obj.city.name)
  public city: AvailableCity;

  @ApiProperty({
    description: "Task's status",
    enum: TaskStatus,
    example: TaskStatus.New,
  })
  @Expose()
  @Transform(({ obj }) => obj.status.name)
  public status: TaskStatus;

  @ApiProperty({
    description: "Task's customer",
    example: 'da7f1411-dd49-4689-a2de-cda2f0e9bf85',
  })
  @Expose()
  public customerId: string;

  @ApiProperty({
    description: "Task's comments count",
    type: Number,
    example: 12,
  })
  @Expose()
  @Transform(({ obj }) => parseInt(obj.commentsCount))
  public commentsCount: number;

  @ApiProperty({
    description: 'Date of creation task',
    example: '2023-12-13T21:06:44.253Z',
  })
  @Expose()
  public createdAt: number;
}
