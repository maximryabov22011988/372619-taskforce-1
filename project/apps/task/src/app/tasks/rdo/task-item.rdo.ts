import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { TaskRdo } from '@project/libs/rdo';

export class TaskItemRdo extends TaskRdo {
  @ApiProperty({
    description: "Task's comments count",
    type: Number,
    example: 12,
  })
  @Expose()
  @Transform(({ obj }) => parseInt(obj.commentsCount, 10))
  public commentsCount: number;

  @ApiProperty({
    description: "Task's responses count",
    type: Number,
    example: 12,
  })
  @Expose()
  @Transform(({ obj }) => obj.responses?.length ?? 0)
  public responsesCount: number;
}
