import { TaskStatus } from '@project/libs/shared-types';

export class UpdateTaskDto {
  public contractorId?: string;

  public status?: TaskStatus;
}
