import { Inject, Injectable } from '@nestjs/common';
import { QueryBuilderType } from 'objection';
import {
  CommentModel,
  CommentModelProperties,
} from '../../database/models/comment.model';
import { CommentQuery } from '@project/libs/queries';

@Injectable()
export class CommentsRepository {
  constructor(
    @Inject(CommentModel) private readonly commentModel: typeof CommentModel
  ) {}

  public async findById(commentId: number): Promise<CommentModel> {
    return this.commentModel
      .query()
      .where({ id: commentId })
      .returning('*')
      .first();
  }

  public async create(
    commentData: CommentModelProperties
  ): Promise<CommentModel> {
    return this.commentModel.query().insert(commentData).returning('*');
  }

  public async findAllForTask(
    taskId: number,
    query: CommentQuery
  ): Promise<CommentModel[]> {
    const queryBuilder = this.commentModel.query().where({ taskId });
    this.applyPagination(queryBuilder, query);

    return queryBuilder.returning('*');
  }

  public async deleteAllForTask(taskId: number): Promise<void> {
    await this.commentModel.query().where({ taskId }).delete();
  }

  public async delete(commentId: number): Promise<void> {
    await this.commentModel.query().where({ id: commentId }).delete();
  }

  private applyPagination(
    queryBuilder: QueryBuilderType<CommentModel>,
    query: CommentQuery
  ) {
    const { page, limit } = query;

    queryBuilder.offset(limit * (page - 1)).limit(limit);
  }
}
