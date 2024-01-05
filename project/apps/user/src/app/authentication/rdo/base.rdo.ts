import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class BaseAuthRdo {
  @ApiProperty({
    description: 'Access token',
    example:
      'eyJhbGciOiJIUzUxMiIsI.hgJhbGciOiTOOzUxMiIsI.ytJhbGciOiJgreUzUxMiIsI',
  })
  @Expose()
  public accessToken: string;
}
