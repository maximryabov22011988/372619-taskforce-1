import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus } from '@project/libs/shared-types';

export class UpdateTaskDto {
  @ApiProperty({
    description: "Task's contractor",
    example: 'fbc55fd6-9ac2-4aad-8b79-5adfb2faed8d',
  })
  public contractorId?: string;

  @ApiProperty({
    description: "Task's status",
    enum: TaskStatus,
    example: TaskStatus.New,
  })
  public status?: TaskStatus;
}
