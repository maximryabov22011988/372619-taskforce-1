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

  @ApiProperty({
    description: 'Comment author id',
    example: 'da7f1411-dd49-4689-a2de-cda2f0e9bf85',
  })
  @Expose()
  public authorId: string;
}
