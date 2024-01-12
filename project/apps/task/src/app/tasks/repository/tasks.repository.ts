import { Inject, Injectable } from '@nestjs/common';
import { QueryBuilderType } from 'objection';
import { CRUDRepository } from '@project/libs/utils-types';
import {
  TaskModel,
  TaskModelProperties,
} from '../../../database/models/task.model';
import { TasksTagsModel } from '../../../database/models/tasks-tags.model';
import { CommentModel } from '../../../database/models/comment.model';
import { mapSortingToColumn, TaskQuery } from '../tasks.query';

@Injectable()
export class TasksRepository
  implements CRUDRepository<TaskModelProperties, number, TaskModel>
{
  constructor(
    @Inject(TaskModel) private readonly taskModel: typeof TaskModel,
    @Inject(TasksTagsModel)
    private readonly tasksTagsModel: typeof TasksTagsModel
  ) {}

  public async findAll(query: TaskQuery): Promise<TaskModel[]> {
    const queryBuilder = this.taskModel
      .query()
      .select(`${TaskModel.tableName}.*`)
      .count({ commentsCount: `${CommentModel.tableName}.id` })
      .leftJoinRelated(CommentModel.tableName)
      .groupBy(`${TaskModel.tableName}.id`);

    await this.applyFilters(queryBuilder, query);
    this.applyPaginationAndSorting(queryBuilder, query);

    // FIXME добавить инфу: количество откликов
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

  private async applyFilters(
    queryBuilder: QueryBuilderType<TaskModel>,
    query: TaskQuery
  ) {
    const { cityId, categoryId, tagId } = query;

    if (cityId) {
      queryBuilder.where({ city_id: cityId });
    }

    if (categoryId) {
      queryBuilder.where({ category_id: categoryId });
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

  private applyPaginationAndSorting(
    queryBuilder: QueryBuilderType<TaskModel>,
    query: TaskQuery
  ) {
    const { page, limit, sorting } = query;

    queryBuilder
      .offset(limit * (page - 1))
      .limit(limit)
      .orderBy(mapSortingToColumn(sorting), 'desc');
  }
}
