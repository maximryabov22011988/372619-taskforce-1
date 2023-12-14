import { Inject, Injectable } from '@nestjs/common';
import { Comment } from '@project/libs/shared-types';
import { CommentModel } from '../../database/models/comment.model';
import { CommentEntity } from './comments.entity';

@Injectable()
export class CommentsRepository {
  constructor(
    @Inject(CommentModel) private readonly commentModel: typeof CommentModel
  ) {}

  public async findById(commentId: number) {
    return this.commentModel
      .query()
      .where({ id: commentId })
      .returning('*')
      .first()
      .castTo<Comment>();
  }

  public async create(item: CommentEntity): Promise<Comment> {
    return this.commentModel
      .query()
      .insert(item.toObject())
      .returning('*')
      .castTo<Comment>();
  }

  public async findAllForTask(taskId: number): Promise<Comment[]> {
    return this.commentModel
      .query()
      .where({ taskId })
      .returning('*')
      .castTo<Comment[]>();
  }

  public async deleteAllForTask(taskId: number): Promise<void> {
    await this.commentModel.query().where({ taskId }).delete();
  }

  public async delete(commentId: number): Promise<void> {
    await this.commentModel.query().where({ id: commentId }).delete();
  }
}
