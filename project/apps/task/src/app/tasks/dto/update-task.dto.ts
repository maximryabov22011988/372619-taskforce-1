import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsUUID, IsEnum } from 'class-validator';
import { TaskStatusId } from '@project/libs/shared-types';

export class UpdateTaskDto {
  @ApiProperty({
    description: "Task's contractor id",
    example: 'fbc55fd6-9ac2-4aad-8b79-5adfb2faed8d',
  })
  @IsOptional()
  @IsString()
  @IsUUID(4)
  public contractorId?: string;

  @ApiProperty({
    description: "Task's status id",
    enum: TaskStatusId,
    example: TaskStatusId.New,
  })
  @IsOptional()
  @IsEnum(TaskStatusId)
  public statusId?: TaskStatusId;
}
