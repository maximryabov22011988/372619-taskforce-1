import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({
    description: 'Comment text',
    example: 'Some comment text',
  })
  public text: string;

  @ApiProperty({
    description: 'Task identifier',
    example: 'fbc55fd6-9ac2-4aad-8b79-5adfb2faed8d',
  })
  public taskId: string;
}
