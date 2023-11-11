import { ApiProperty } from '@nestjs/swagger';

export class LogoutUserDto {
  @ApiProperty({
    description: 'Access token',
    example:
      'eyJhbGciOiJIUzUxMiIsI.hgJhbGciOiTOOzUxMiIsI.ytJhbGciOiJgreUzUxMiIsI',
  })
  public accessToken: string;
}
