import { BaseModel } from './base.model';

export class UsersSpecializationsModel extends BaseModel {
  public static get tableName() {
    return 'users_specializations';
  }

  public static get idColumn() {
    return ['userId', 'specializationId'];
  }

  public readonly userId: string;
  public readonly specializationId: number;

  public static get jsonSchema() {
    return {
      type: 'object',
      required: ['userId', 'specializationId'],
      properties: {
        userId: {
          type: 'string',
          format: 'uuid',
        },
        specializationId: {
          type: 'integer',
        },
      },
    };
  }
}
