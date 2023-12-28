import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { UserRole } from '@project/libs/shared-types';

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
    description: "User's city id",
    example: 1,
  })
  @Expose()
  public cityId: number;

  @ApiProperty({
    description: "User's role",
    enum: UserRole,
    example: UserRole.Customer,
  })
  @Expose()
  @Transform(({ obj }) => obj.role.name)
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

  @ApiProperty({
    description: 'Registration date',
    example: '1977-11-11T08:55:00.000Z',
  })
  @Expose()
  public createdAt: number;
}
