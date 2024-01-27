import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { TaskStatus } from '@project/libs/shared-types';

export class StatusRdo {
  @ApiProperty({
    description: 'Unique identifier',
    example: 1,
  })
  @Expose()
  public id: number;

  @ApiProperty({
    description: 'Status name',
    enum: TaskStatus,
    example: TaskStatus.New,
  })
  @Expose()
  public name: string;
}
