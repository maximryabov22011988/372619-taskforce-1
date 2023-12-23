import { Model } from 'objection';
import { Task, Uuid } from '@project/libs/shared-types';
import { BaseModel } from './base.model';
import { TagModel } from './tag.model';
import { CommentModel } from './comment.model';
import { CityModel } from './city.model';
import { StatusModel } from './status.model';
import { CategoryModel } from './category.model';

export type ITaskModel = Omit<Task, 'executionDate'> & {
  executionDate: Date;
};

export class TaskModel extends BaseModel {
  public static get tableName() {
    return 'tasks';
  }

  public static get idColumn() {
    return 'id';
  }

  public readonly title: string;
  public readonly description: string;
  public readonly price: number;
  public readonly executionDate: string;
  public readonly imageUrl: string;
  public readonly address: string;
  public readonly categoryId: number;
  public readonly cityId: number;
  public readonly statusId: number;
  public readonly contractorId: Uuid;
  public readonly customerId: Uuid;
  public readonly createdAt: number;
  public readonly updatedAt: number;

  public static get jsonSchema() {
    return {
      type: 'object',
      required: [
        'title',
        'description',
        'categoryId',
        'cityId',
        'statusId',
        'customerId',
      ],
      properties: {
        id: {
          type: 'integer',
        },
        title: {
          type: 'string',
          minLength: 1,
          maxLength: 50,
        },
        description: {
          type: 'string',
          minLength: 1,
          maxLength: 1024,
        },
        price: {
          type: 'integer',
        },
        executionDate: {
          type: 'string',
          format: 'date',
        },
        imageUrl: {
          type: 'string',
        },
        address: {
          type: 'string',
          minLength: 1,
          maxLength: 255,
        },
        categoryId: {
          type: 'integer',
        },
        cityId: {
          type: 'integer',
        },
        statusId: {
          type: 'integer',
        },
        contractorId: {
          oneOf: [
            {
              type: 'string',
              format: 'uuid',
            },
            {
              type: 'null',
            },
          ],
        },
        customerId: {
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

  public static relationMappings = {
    status: {
      relation: Model.HasOneRelation,
      modelClass: StatusModel,
      join: {
        from: 'tasks.statusId',
        to: 'statuses.id',
      },
    },
    category: {
      relation: Model.HasOneRelation,
      modelClass: CategoryModel,
      join: {
        from: 'tasks.categoryId',
        to: 'categories.id',
      },
    },
    city: {
      relation: Model.HasOneRelation,
      modelClass: CityModel,
      join: {
        from: 'tasks.cityId',
        to: 'cities.id',
      },
    },
    comments: {
      relation: Model.HasManyRelation,
      modelClass: CommentModel,
      join: {
        from: 'tasks.id',
        to: 'comments.taskId',
      },
    },
    tags: {
      relation: Model.ManyToManyRelation,
      modelClass: TagModel,
      join: {
        from: 'tasks.id',
        through: {
          from: 'tasksTags.taskId',
          to: 'tasksTags.tagId',
        },
        to: 'tags.id',
      },
    },
  };
}
