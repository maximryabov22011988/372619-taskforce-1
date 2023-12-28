import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ReviewRdo {
  @ApiProperty({
    description: 'Unique identifier',
    example: 1,
  })
  @Expose()
  public id: number;

  @ApiProperty({
    description: 'Review text',
    example: 'Some review text',
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
    description: 'Rating',
    example: 4,
  })
  @Expose()
  public rating: number;
}
