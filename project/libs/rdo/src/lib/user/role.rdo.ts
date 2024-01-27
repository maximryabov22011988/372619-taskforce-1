import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { UserRole } from '@project/libs/shared-types';

export class RoleRdo {
  @ApiProperty({
    description: 'Unique identifier',
    example: 1,
  })
  @Expose()
  public id: number;

  @ApiProperty({
    description: 'Role name',
    enum: UserRole,
    example: UserRole.Contractor,
  })
  @Expose()
  public name: string;
}
