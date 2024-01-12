import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateTokensDto {
  @ApiProperty({
    description: 'Refresh token',
    example: 'c84f18a2-c6c7-4850-be15-93f9cbaef3b3',
  })
  @IsNotEmpty()
  @IsString()
  public refreshToken: string;
}
