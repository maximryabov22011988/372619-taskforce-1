import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({
    description: 'Task identifier',
    example: 'fbc55fd6-9ac2-4aad-8b79-5adfb2faed8d',
  })
  public taskId: string;

  @ApiProperty({
    description: 'Review text',
    example: 'Some review text',
  })
  public text: string;

  @ApiProperty({
    description: 'Rating',
    example: 4,
  })
  public rating: number;
}
