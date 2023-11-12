import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { AvailableCity, UserRole } from '@project/libs/shared-types';

export class ContractorUserRdo {
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
    description: 'Registration date',
    example: '1977-11-11T08:55:00.000Z',
  })
  @Expose()
  public createdAt: string;

  @ApiProperty({
    description: "User's city",
    enum: AvailableCity,
    example: AvailableCity.Moscow,
  })
  @Expose()
  public city: AvailableCity;

  @ApiProperty({
    description: "User's role",
    enum: UserRole,
    example: UserRole.Customer,
  })
  @Expose()
  public role: UserRole;

  @ApiProperty({
    description: "User's unique email address",
    example: 'john.doe@yahoo.com',
  })
  @Expose()
  public email: string;

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
  public specialization: string;

  @ApiProperty({
    description: "User's completed tasks count",
    example: 10,
  })
  @Expose()
  public completedTasksCount: number;

  @ApiProperty({
    description: "User's failed tasks count",
    example: 1,
  })
  @Expose()
  public failedTasksCount: number;

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
