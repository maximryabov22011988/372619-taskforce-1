import { Uuid } from '@project/libs/shared-types';
import { Model } from 'objection';
import { BaseModel } from './base.model';
import { RoleModel } from './role.model';
import { SpecializationModel } from './specialization.model';

export type UserModelProperties = Pick<
  UserModel,
  | 'firstname'
  | 'lastname'
  | 'email'
  | 'cityId'
  | 'roleId'
  | 'avatarUrl'
  | 'info'
  | 'birthDate'
> & { id?: Uuid };

export class UserModel extends BaseModel<Uuid> {
  public static get tableName() {
    return 'users';
  }

  public static get idColumn() {
    return 'id';
  }

  public readonly firstname: string;
  public readonly lastname: string;
  public readonly email: string;
  public readonly cityId: number;
  public readonly passwordHash: string;
  public readonly roleId: number;
  public readonly avatarUrl?: string;
  public readonly info?: string;
  public readonly birthDate: string;
  public readonly createdAt: number;
  public readonly updatedAt: number;

  public static get jsonSchema() {
    return {
      type: 'object',
      required: [
        'firstname',
        'lastname',
        'email',
        'cityId',
        'passwordHash',
        'roleId',
        'birthDate',
      ],
      properties: {
        id: {
          type: 'string',
        },
        firstname: {
          type: 'string',
          minLength: 1,
          maxLength: 25,
        },
        lastname: {
          type: 'string',
          minLength: 1,
          maxLength: 25,
        },
        email: {
          type: 'string',
          minLength: 1,
          maxLength: 250,
        },
        cityId: {
          type: 'integer',
        },
        passwordHash: {
          type: 'string',
          minLength: 1,
          maxLength: 60,
        },
        roleId: {
          type: 'integer',
        },
        avatarUrl: {
          type: 'string',
        },
        info: {
          type: 'string',
          maxLength: 300,
        },
        birthDate: {
          type: 'string',
          format: 'date',
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
    role: {
      relation: Model.HasOneRelation,
      modelClass: RoleModel,
      join: {
        from: 'users.roleId',
        to: 'roles.id',
      },
    },
    specializations: {
      relation: Model.ManyToManyRelation,
      modelClass: SpecializationModel,
      join: {
        from: 'users.id',
        through: {
          from: 'usersSpecializations.userId',
          to: 'usersSpecializations.specializationId',
        },
        to: 'specializations.id',
      },
    },
  };
}
