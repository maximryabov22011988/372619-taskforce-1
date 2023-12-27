import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CommentRdo {
  @ApiProperty({
    description: 'Unique identifier',
    example: 1,
  })
  @Expose()
  public id?: number;

  @ApiProperty({
    description: 'Comment text',
    example: 'Some comment text',
  })
  @Expose()
  public text: string;

  @ApiProperty({
    description: 'Task identifier',
    example: 1,
  })
  @Expose()
  public taskId: number;
}
