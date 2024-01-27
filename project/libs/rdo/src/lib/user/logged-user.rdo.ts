import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class LoggedUserRdo {
  @ApiProperty({
    description: 'Access token',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjYzU1MzQ0OC03NzIxLTQzZjgtYTZkZS04NDk2YWVlMTQ5OTMiLCJlbWFpbCI6ImpvaG45MUBkb2UuY29tIiwicm9sZUlkIjoxLCJsYXN0bmFtZSI6IkRvZSIsImZpcnN0bmFtZSI6IkpvaG4iLCJpYXQiOjE3MDQ2NDQ4OTcsImV4cCI6MTcwNDY0ODQ5N30._2E2nVwX3CBh5Vcyy90iBn_E-UPqp4JS2_g9ZsYyk54',
  })
  @Expose()
  public accessToken: string;

  @ApiProperty({
    description: 'Refresh token',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImpvaG4xQGRvZS5jb20iLCJyb2xlSWQiOjEsImxhc3RuYW1lIjoiRG9lIiwiZmlyc3RuYW1lIjoiSm9obiIsImlhdCI6MTcwNTUyMzIxMSwiZXhwIjoxNzA2MTI4MDExfQ.LanTMrE-jvtZ5xw1Rmu1cJijJkdeLCsgTehJM9qc7Ik',
  })
  @Expose()
  public refreshToken: string;
}
