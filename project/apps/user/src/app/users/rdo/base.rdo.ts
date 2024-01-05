import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { UserRole } from '@project/libs/shared-types';
import { dateTimeService } from '@project/services';

export class BaseUserRdo {
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
    description: 'Registration date',
    example: '1977-11-11T00:00:00.000Z',
  })
  @Expose()
  @Transform(({ obj }) => dateTimeService.formatDate(obj.registrationDate))
  public registrationDate: string;
}
