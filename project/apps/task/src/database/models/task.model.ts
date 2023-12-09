import { Model } from 'objection';
import { Uuid } from '@project/libs/shared-types';
import { BaseModel } from './base.model';
import { TagModel } from './tag.model';
import { CommentModel } from './comment.model';

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
  public readonly execution_date: Date;
  public readonly image_url: string;
  public readonly address: string;
  public readonly category_id: number;
  public readonly city_id: number;
  public readonly status_id: number;
  public readonly contractor_id: Uuid;
  public readonly customer_id: Uuid;
  public created_at: Date;
  public updated_at: Date;

  public $beforeInsert() {
    this.created_at = new Date();
  }

  public $beforeUpdate() {
    this.updated_at = new Date();
  }

  public static get jsonSchema() {
    return {
      type: 'object',
      required: [
        'title',
        'description',
        'category_id',
        'city_id',
        'status_id',
        'customer_id',
        'created_at',
        'updated_at',
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
        execution_date: {
          type: 'date',
        },
        image_url: {
          type: 'string',
        },
        address: {
          type: 'string',
          minLength: 1,
          maxLength: 255,
        },
        category_id: {
          type: 'integer',
        },
        city_id: {
          type: 'integer',
        },
        status_id: {
          type: 'integer',
        },
        contractor_id: {
          type: ['string', 'null'],
        },
        customer_id: {
          type: 'string',
        },
        created_at: {
          type: 'date',
        },
        updated_at: {
          type: 'date',
        },
      },
    };
  }

  public static relationMappings = {
    comments: {
      relation: Model.HasManyRelation,
      modelClass: CommentModel,
      join: {
        from: `${TaskModel.tableName}.${TaskModel.idColumn}`,
        to: `${CommentModel.tableName}.task_id`,
      },
    },
    tags: {
      relation: Model.ManyToManyRelation,
      modelClass: TagModel,
      join: {
        from: `${TaskModel.tableName}.${TaskModel.idColumn}`,
        through: {
          from: 'tasks_tags.task_id',
          to: 'tasks_tags.tag_id',
        },
        to: `${TagModel.tableName}.${TagModel.idColumn}`,
      },
    },
  };
}
