import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({
    description: 'Review text',
    example: 'Some review text',
  })
  public text: string;

  @ApiProperty({
    description: 'Task identifier',
    example: 1,
  })
  public taskId: number;

  @ApiProperty({
    description: 'Rating',
    example: 4,
  })
  public rating: number;
}
