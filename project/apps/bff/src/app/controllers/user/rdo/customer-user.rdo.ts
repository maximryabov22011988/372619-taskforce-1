import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { BaseUserRdo } from '@project/libs/rdo';

export class CustomerUserRdo extends BaseUserRdo {
  @ApiProperty({
    description: "User's city",
    example: 'Москва',
  })
  @Expose()
  public city: string;
}
