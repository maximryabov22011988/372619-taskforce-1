import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as makeUuid } from 'uuid';
import { CommentModel } from '../../database/models/comment.model';
import { CommentQuery } from './comments.query';
import { CommentsRepository } from './comments.repository';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(private readonly commentsRepository: CommentsRepository) {}

  public async createComment(dto: CreateCommentDto): Promise<CommentModel> {
    return this.commentsRepository.create({
      ...dto,
      authorId: makeUuid(),
    });
  }

  public async deleteComment(commentId: number): Promise<void> {
    await this.findById(commentId);
    await this.commentsRepository.delete(commentId);
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

  private async findById(commentId: number): Promise<CommentModel> {
    const comment = await this.commentsRepository.findById(commentId);
    if (!comment) {
      throw new NotFoundException('Comment was not found');
    }

    return comment;
  }
}
