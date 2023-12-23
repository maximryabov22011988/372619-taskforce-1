import { Model } from 'objection';
import { Uuid } from '@project/libs/shared-types';
import { BaseModel } from './base.model';
import { TaskModel } from './task.model';

export class CommentModel extends BaseModel {
  public static get tableName() {
    return 'comments';
  }

  public static get idColumn() {
    return 'id';
  }

  public readonly text: string;
  public readonly taskId: number;
  public readonly userId: Uuid;
  public readonly createdAt: number;
  public readonly updatedAt: number;

  public static get jsonSchema() {
    return {
      type: 'object',
      required: ['text', 'taskId', 'userId'],
      properties: {
        id: {
          type: 'integer',
        },
        text: {
          type: 'string',
          minLength: 1,
          maxLength: 300,
        },
        taskId: {
          type: 'integer',
        },
        userId: {
          type: 'string',
          format: 'uuid',
        },
        createdAt: {
          type: 'integer',
        },
        updatedAt: {
          type: 'integer',
        },
      },
    };
  }

  public static relationMappings = {
    task: {
      relation: Model.BelongsToOneRelation,
      modelClass: TaskModel,
      join: {
        from: 'comments.taskId',
        to: 'tasks.id',
      },
    },
  };
}
