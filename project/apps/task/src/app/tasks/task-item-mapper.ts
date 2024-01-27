import { fillObject } from '@project/libs/utils-core';
import { Task } from '@project/libs/shared-types';
import { TaskModel } from '../../database/models/task.model';
import { TaskItemRdo } from './rdo/task-item.rdo';

export const mapToTaskItem = (task: TaskModel): Task =>
  fillObject(TaskItemRdo, task);
