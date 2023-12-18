import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({
    description: 'Comment text',
    example: 'Some comment text',
  })
  public text: string;

  @ApiProperty({
    description: 'Task identifier',
    example: 1,
  })
  public taskId: number;
}
