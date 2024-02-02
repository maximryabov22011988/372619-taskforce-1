import { fillObject } from '@project/libs/utils-core';
import { Task } from '@project/libs/shared-types';
import { TaskRdo } from '@project/libs/rdo';
import { TaskModel } from '../../database/models/task.model';

export const mapToTask = (task: TaskModel): Task => fillObject(TaskRdo, task);
