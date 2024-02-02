import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsEnum } from 'class-validator';
import { TaskStatusId } from '@project/libs/shared-types';

export class ChangeTaskStatusDto {
  @ApiProperty({
    description: "Task's status id",
    enum: TaskStatusId,
    example: TaskStatusId.New,
  })
  @IsOptional()
  @IsEnum(TaskStatusId)
  public statusId: TaskStatusId;
}
