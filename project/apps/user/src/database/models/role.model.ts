import { BaseModel } from './base.model';

export class RoleModel extends BaseModel {
  public static get tableName() {
    return 'roles';
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
          enum: ['customer', 'contractor'],
          minLength: 1,
          maxLength: 25,
        },
      },
    };
  }
}
