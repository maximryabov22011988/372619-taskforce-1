import { fillObject } from '@project/libs/utils-core';
import { Task } from '@project/libs/shared-types';
import { TaskItemRdo } from '@project/libs/rdo';
import { TaskModel } from '../../database/models/task.model';

export const mapToTaskItem = (task: TaskModel): Task =>
  fillObject(TaskItemRdo, task);
