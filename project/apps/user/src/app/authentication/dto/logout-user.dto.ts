import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsJWT, IsNotEmpty } from 'class-validator';

export class LogoutUserDto {
  @ApiProperty({
    description: 'Access token',
    example:
      'eyJhbGciOiJIUzUxMiIsI.hgJhbGciOiTOOzUxMiIsI.ytJhbGciOiJgreUzUxMiIsI',
  })
  @IsNotEmpty()
  @IsString()
  @IsJWT()
  public accessToken: string;
}
