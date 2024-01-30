import { ApiProperty, PickType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { BaseUserRdo } from './base-user.rdo';

export class CustomerUserRdo extends PickType(BaseUserRdo, [
  'id',
  'firstname',
  'lastname',
  'info',
  'role',
  'email',
  'registrationDate',
] as const) {
  @ApiProperty({
    description: "User's city id",
    example: 1,
  })
  @Expose()
  public cityId: number;
}
