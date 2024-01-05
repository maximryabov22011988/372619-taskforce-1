import { BaseModel } from './base.model';
import { Uuid } from '@project/libs/shared-types';

export type CommentModelProperties = Pick<
  CommentModel,
  'text' | 'taskId' | 'authorId'
>;

export class CommentModel extends BaseModel {
  public static get tableName() {
    return 'comments';
  }

  public static get idColumn() {
    return 'id';
  }

  public readonly text: string;
  public readonly taskId: number;
  public readonly authorId: Uuid;
  public readonly createdAt: number;
  public readonly updatedAt: number;

  public static get jsonSchema() {
    return {
      type: 'object',
      required: ['text', 'taskId'],
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
        authorId: {
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
}
