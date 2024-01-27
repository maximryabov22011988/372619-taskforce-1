import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class SelectTaskContractorDto {
  @ApiProperty({
    description: "Task's contractor id",
    example: 'fbc55fd6-9ac2-4aad-8b79-5adfb2faed8d',
  })
  @IsOptional()
  @IsString()
  @IsUUID(4)
  public contractorId: string;
}
