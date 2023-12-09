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
  public readonly task_id: number;
  public readonly customer_id: Uuid;
  public created_at: Date;
  public updated_at: Date;

  public $beforeInsert() {
    this.created_at = new Date();
  }

  public $beforeUpdate() {
    this.updated_at = new Date();
  }

  public static get jsonSchema() {
    return {
      type: 'object',
      required: ['text', 'task_id', 'user_id'],
      properties: {
        id: {
          type: 'integer',
        },
        name: {
          type: 'string',
          minLength: 1,
          maxLength: 300,
        },
        task_id: {
          type: 'integer',
        },
        user_id: {
          type: 'string',
        },
        created_at: {
          type: 'date',
        },
        updated_at: {
          type: 'date',
        },
      },
    };
  }

  public static relationMappings = {
    task: {
      relation: Model.BelongsToOneRelation,
      modelClass: TaskModel,
      join: {
        from: `${CommentModel.tableName}.task_id`,
        to: `${TaskModel.tableName}.${TaskModel.idColumn}`,
      },
    },
  };
}
