import { BaseModel } from './base.model';

export class CategoryModel extends BaseModel {
  public static get tableName() {
    return 'categories';
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
          minLength: 1,
          maxLength: 50,
        },
      },
    };
  }
}
