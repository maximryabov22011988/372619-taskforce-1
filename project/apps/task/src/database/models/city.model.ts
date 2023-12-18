import { BaseModel } from './base.model';

export class CityModel extends BaseModel {
  public static get tableName() {
    return 'cities';
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
          enum: ['Москва', 'Санкт-Петербург', 'Владивосток'],
          minLength: 1,
          maxLength: 20,
        },
      },
    };
  }
}
