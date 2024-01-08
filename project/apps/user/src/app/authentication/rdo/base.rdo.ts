import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class BaseAuthRdo {
  @ApiProperty({
    description: 'Access token',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjYzU1MzQ0OC03NzIxLTQzZjgtYTZkZS04NDk2YWVlMTQ5OTMiLCJlbWFpbCI6ImpvaG45MUBkb2UuY29tIiwicm9sZUlkIjoxLCJsYXN0bmFtZSI6IkRvZSIsImZpcnN0bmFtZSI6IkpvaG4iLCJpYXQiOjE3MDQ2NDQ4OTcsImV4cCI6MTcwNDY0ODQ5N30._2E2nVwX3CBh5Vcyy90iBn_E-UPqp4JS2_g9ZsYyk54',
  })
  @Expose()
  public accessToken: string;
}
