import assign from 'lodash/assign';
import { fillObject } from '@project/libs/utils-core';
import { Task } from '@project/libs/shared-types';
import { TaskModel } from '../../database/models/task.model';
import { TaskRdo } from './rdo/task.rdo';

export const mapToTask = (task: TaskModel, executionDate: string): Task =>
  fillObject(
    TaskRdo,
    assign(task, {
      executionDate,
    })
  );
