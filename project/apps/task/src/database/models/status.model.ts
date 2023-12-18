import { BaseModel } from './base.model';

export class StatusModel extends BaseModel {
  public static get tableName() {
    return 'statuses';
  }

  public static get idColumn() {
    return 'id';
  }

  public readonly name: string;

  public static get jsonSchema() {
    return {
      type: 'object',
      required: ['name'],
      properties: {
        id: {
          type: 'integer',
        },
        name: {
          type: 'string',
          enum: ['new', 'cancelled', 'in-progress', 'done', 'failed'],
          minLength: 1,
          maxLength: 15,
        },
      },
    };
  }
}
