import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { AvailableCity, TaskStatus } from '@project/libs/shared-types';

class CustomerRdo {
  @ApiProperty({
    description: 'Unique identifier',
    example: '4ff6e921-36c4-4f80-ae41-919c06c0c5c3',
  })
  @Expose()
  public id: string;

  @ApiProperty({
    description: "User's first name",
    example: 'John',
  })
  @Expose()
  public firstname: string;

  @ApiProperty({
    description: "User's last name",
    example: 'Doe',
  })
  @Expose()
  public lastname: string;

  @ApiProperty({
    description: "User's unique email address",
    example: 'john.doe@yahoo.com',
  })
  @Expose()
  public email: string;
}

export class TaskItemWithCustomerDataRdo {
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
    type: CustomerRdo,
  })
  @Expose()
  public customer: CustomerRdo;

  @ApiProperty({
    description: 'Date of creation task',
    example: '2023-12-13T21:06:44.253Z',
  })
  @Expose()
  public createdAt: number;

  @ApiProperty({
    description: "Task's comments count",
    type: Number,
    example: 12,
  })
  @Expose()
  public commentsCount: number;

  @ApiProperty({
    description: "Task's responses count",
    type: Number,
    example: 12,
  })
  @Expose()
  public responsesCount: number;
}
