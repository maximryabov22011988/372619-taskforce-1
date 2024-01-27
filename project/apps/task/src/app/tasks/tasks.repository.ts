import { Inject, Injectable } from '@nestjs/common';
import { QueryBuilderType } from 'objection';
import { CRUDRepository } from '@project/libs/utils-types';
import { MyTaskQuery, TaskQuery, TaskSorting } from '@project/libs/queries';
import { TaskStatusId, UserRoleId, Uuid } from '@project/libs/shared-types';
import {
  TaskModel,
  TaskModelProperties,
} from '../../database/models/task.model';
import { TasksTagsModel } from '../../database/models/tasks-tags.model';
import { CommentModel } from '../../database/models/comment.model';

export interface FindMyTasksParams {
  userId: Uuid;
  roleId: UserRoleId;
  query: MyTaskQuery;
}

@Injectable()
export class TasksRepository
  implements CRUDRepository<TaskModelProperties, number, TaskModel>
{
  constructor(
    @Inject(TaskModel) private readonly taskModel: typeof TaskModel,
    @Inject(TasksTagsModel)
    private readonly tasksTagsModel: typeof TasksTagsModel
  ) {}

  public async findAllByStatus(
    query: TaskQuery,
    statusId: TaskStatusId
  ): Promise<TaskModel[]> {
    const queryBuilder = this.getQueryBuilderWithCommentsCount();

    await this.applyListFilters(queryBuilder, query, statusId);
    this.applyListPaginationAndSorting(queryBuilder, query);

    return queryBuilder
      .withGraphFetched('tags')
      .withGraphFetched('city')
      .withGraphFetched('status')
      .withGraphFetched('category')
      .returning('*');
  }

  public async findOwn({
    userId,
    roleId,
    query,
  }: FindMyTasksParams): Promise<TaskModel[]> {
    const columnName =
      roleId === UserRoleId.Customer ? 'customerId' : 'contractorId';

    const queryBuilder = this.getQueryBuilderWithCommentsCount();
    queryBuilder.where({
      [columnName]: userId,
    });

    this.applyMyTaskListFilters(queryBuilder, query);
    this.applyMyTaskListSorting(queryBuilder, roleId);

    return queryBuilder
      .withGraphFetched('tags')
      .withGraphFetched('city')
      .withGraphFetched('status')
      .withGraphFetched('category')
      .returning('*');
  }

  public async findById(id: number): Promise<TaskModel> {
    return this.taskModel
      .query()
      .where({ id })
      .withGraphFetched('tags')
      .withGraphFetched('city')
      .withGraphFetched('status')
      .withGraphFetched('category')
      .returning('*')
      .first();
  }

  public async findAllByCustomerAndStatus(
    customerId: Uuid,
    statusId?: TaskStatusId
  ) {
    return this.taskModel
      .query()
      .where({ customerId })
      .modify((queryBuilder) => {
        if (statusId) {
          queryBuilder.where({ statusId });
        }
      })
      .returning('*')
      .execute();
  }

  public async findAllByContractorAndStatus(
    contractorId: Uuid,
    statusId: TaskStatusId
  ): Promise<TaskModel[]> {
    return this.taskModel
      .query()
      .where({ contractorId, statusId })
      .returning('*')
      .execute();
  }

  public async findOneByContractorAndStatus(
    taskId: number,
    contractorId: Uuid,
    statusId: TaskStatusId
  ): Promise<TaskModel> {
    return this.taskModel
      .query()
      .where({ id: taskId, contractorId, statusId })
      .returning('*')
      .first();
  }

  public async create(taskData: TaskModelProperties): Promise<TaskModel> {
    return this.taskModel
      .query()
      .insert(taskData)
      .withGraphFetched('tags')
      .withGraphFetched('city')
      .withGraphFetched('status')
      .withGraphFetched('category')
      .returning('*');
  }

  public async update(
    id: number,
    taskData: TaskModelProperties
  ): Promise<TaskModel> {
    return this.taskModel
      .query()
      .patchAndFetchById(id, taskData)
      .withGraphFetched('tags')
      .withGraphFetched('city')
      .withGraphFetched('status')
      .withGraphFetched('category')
      .returning('*');
  }

  public async delete(id: number): Promise<void> {
    await this.taskModel.query().where({ id }).delete();
  }

  private getQueryBuilderWithCommentsCount(): QueryBuilderType<TaskModel> {
    return this.taskModel
      .query()
      .select(`${TaskModel.tableName}.*`)
      .count({ commentsCount: `${CommentModel.tableName}.id` })
      .leftJoinRelated(CommentModel.tableName)
      .groupBy(`${TaskModel.tableName}.id`);
  }

  private applyMyTaskListFilters(
    queryBuilder: QueryBuilderType<TaskModel>,
    query: MyTaskQuery
  ) {
    const { statusId } = query;

    if (statusId) {
      queryBuilder.where({ statusId });
    }
  }

  private applyMyTaskListSorting(
    queryBuilder: QueryBuilderType<TaskModel>,
    roleId: UserRoleId
  ) {
    if (roleId === UserRoleId.Customer) {
      queryBuilder.orderBy('createdAt', 'desc');
    }
    if (roleId === UserRoleId.Contractor) {
      queryBuilder.orderBy('status_id', 'asc');
    }
  }

  private async applyListFilters(
    queryBuilder: QueryBuilderType<TaskModel>,
    query: TaskQuery,
    statusId: TaskStatusId
  ) {
    const { cityId, categoryId, tagId } = query;

    if (statusId) {
      queryBuilder.where({ statusId });
    }

    if (cityId) {
      queryBuilder.where({ cityId });
    }

    if (categoryId) {
      queryBuilder.where({ categoryId });
    }

    if (tagId) {
      const tasksTagsModel = await this.tasksTagsModel
        .query()
        .where({ tagId })
        .execute();

      const tasksIds = tasksTagsModel.map(({ taskId }) => taskId);
      queryBuilder.whereIn(`${TaskModel.tableName}.id`, tasksIds);
    }
  }

  private applyListPaginationAndSorting(
    queryBuilder: QueryBuilderType<TaskModel>,
    query: TaskQuery
  ) {
    const { page, limit, sorting } = query;

    queryBuilder.offset(limit * (page - 1)).limit(limit);

    if (sorting === TaskSorting.CreatedAt) {
      queryBuilder.orderBy('createdAt', 'desc');
    }

    if (sorting === TaskSorting.Popular) {
      queryBuilder.orderByRaw('jsonb_array_length("responses") desc');
    }

    if (sorting === TaskSorting.Discussing) {
      queryBuilder.orderBy('commentsCount', 'desc');
    }
  }
}
