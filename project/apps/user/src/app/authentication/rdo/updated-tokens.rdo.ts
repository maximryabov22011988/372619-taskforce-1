import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { BaseAuthRdo } from './base.rdo';

export class UpdatedTokensRdo extends BaseAuthRdo {
  @ApiProperty({
    description: 'Refresh token',
    example: 'b34f18a2-c6c7-4850-be15-93f9cbaef3b3',
  })
  @Expose()
  public refreshToken: string;
}
