import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class ErrorDTO {
  @ApiProperty({ default: 'Internal Server Error' })
  public message: string;

  @ApiProperty({ enum: HttpStatus, default: HttpStatus.INTERNAL_SERVER_ERROR })
  public statusCode: HttpStatus;
}
