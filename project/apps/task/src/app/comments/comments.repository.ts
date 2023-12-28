import { Inject, Injectable } from '@nestjs/common';
import {
  CommentModel,
  CommentModelProperties,
} from '../../database/models/comment.model';

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

  public async findAllForTask(taskId: number): Promise<CommentModel[]> {
    return this.commentModel.query().where({ taskId }).returning('*');
  }

  public async deleteAllForTask(taskId: number): Promise<void> {
    await this.commentModel.query().where({ taskId }).delete();
  }

  public async delete(commentId: number): Promise<void> {
    await this.commentModel.query().where({ id: commentId }).delete();
  }
}
