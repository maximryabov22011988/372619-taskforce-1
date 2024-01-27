import { BaseModel } from './base.model';

export type RefreshTokenModelProperties = Pick<
  RefreshTokenModel,
  'userId' | 'tokenId' | 'expiresIn'
>;

export class RefreshTokenModel extends BaseModel {
  public static get tableName() {
    return 'refresh_sessions';
  }

  public static get idColumn() {
    return 'id';
  }

  public readonly userId: string;
  public readonly tokenId: string;
  public readonly expiresIn: string;
  public readonly createdAt: number;
  public readonly updatedAt: number;

  public static get jsonSchema() {
    return {
      type: 'object',
      required: ['userId', 'tokenId', 'expiresIn'],
      properties: {
        id: {
          type: 'integer',
        },
        userId: {
          type: 'string',
          format: 'uuid',
        },
        tokenId: {
          type: 'string',
          format: 'uuid',
        },
        expiresIn: {
          type: 'string',
          format: 'date-time',
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
