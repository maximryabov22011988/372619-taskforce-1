import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { BaseUserRdo } from './base-user.rdo';

export class CustomerUserRdo extends BaseUserRdo {
  @ApiProperty({
    description: "User's city id",
    example: 1,
  })
  @Expose()
  public cityId: number;
}
