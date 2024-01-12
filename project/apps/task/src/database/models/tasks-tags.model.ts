import { BaseModel } from './base.model';

export class TasksTagsModel extends BaseModel {
  public static get tableName() {
    return 'tasks_tags';
  }

  public static get idColumn() {
    return ['taskId', 'tagId'];
  }

  public readonly taskId: number;
  public readonly tagId: number;

  public static get jsonSchema() {
    return {
      type: 'object',
      required: ['taskId', 'tagId'],
      properties: {
        taskId: {
          type: 'integer',
        },
        tagId: {
          type: 'integer',
        },
      },
    };
  }
}
