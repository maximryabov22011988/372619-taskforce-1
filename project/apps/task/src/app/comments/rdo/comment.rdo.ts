import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CommentRdo {
  @ApiProperty({
    description: 'Unique identifier',
    example: '4ff6e921-36c4-4f80-ae41-919c06c0c5c3',
  })
  @Expose()
  public id?: string;

  @ApiProperty({
    description: 'Comment text',
    example: 'Some comment text',
  })
  @Expose()
  public text: string;

  @ApiProperty({
    description: "Comment's author",
    example: 'fbc55fd6-9ac2-4aad-8b79-5adfb2faed8d',
  })
  @Expose()
  public userId: string;

  @ApiProperty({
    description: 'Task identifier',
    example: 'ahw55fd6-9ac2-4aad-8b79-5adfb2faeyui',
  })
  @Expose()
  public taskId: string;

  @ApiProperty({
    description: 'Date of creation comment',
    example: '2023-12-13T21:06:44.253Z',
  })
  @Expose()
  public createdAt: string;

  @ApiProperty({
    description: 'Comment update date',
    example: '2023-12-13T21:06:44.253Z',
  })
  @Expose()
  public updatedAt: string;
}
