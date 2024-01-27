import { Injectable, NotFoundException } from '@nestjs/common';
import { CommentQuery } from '@project/libs/queries';
import { Uuid } from '@project/libs/shared-types';
import { CreateCommentDto } from '@project/libs/dto';
import { CommentModel } from '../../database/models/comment.model';
import { CommentsRepository } from './comments.repository';

@Injectable()
export class CommentsService {
  constructor(private readonly commentsRepository: CommentsRepository) {}

  public async createComment(
    dto: CreateCommentDto,
    authorId: Uuid
  ): Promise<CommentModel> {
    return this.commentsRepository.create({
      ...dto,
      authorId,
    });
  }

  public async deleteComment(commentId: number): Promise<void> {
    await this.findById(commentId);
    await this.commentsRepository.delete(commentId);
  }

  public async findById(commentId: number): Promise<CommentModel> {
    const commentModel = await this.commentsRepository.findById(commentId);
    if (!commentModel) {
      throw new NotFoundException('Comment was not found');
    }

    return commentModel;
  }

  public async findAllForTask(
    taskId: number,
    query: CommentQuery
  ): Promise<CommentModel[]> {
    return this.commentsRepository.findAllForTask(taskId, query);
  }

  public async deleteAllForTask(taskId: number): Promise<void> {
    await this.commentsRepository.deleteAllForTask(taskId);
  }
}
