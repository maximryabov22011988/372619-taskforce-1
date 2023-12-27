import { Injectable, NotFoundException } from '@nestjs/common';
import { CommentModel } from '../../database/models/comment.model';
import { CommentsRepository } from './comments.repository';
import { CommentEntity } from './comments.entity';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(private readonly commentsRepository: CommentsRepository) {}

  public async createComment(dto: CreateCommentDto): Promise<CommentModel> {
    const commentEntity = new CommentEntity({
      text: dto.text,
      taskId: dto.taskId,
    });

    return this.commentsRepository.create(commentEntity);
  }

  public async deleteComment(commentId: number): Promise<void> {
    await this.findById(commentId);
    await this.commentsRepository.delete(commentId);
  }

  public async findAllForTask(taskId: number): Promise<CommentModel[]> {
    return this.commentsRepository.findAllForTask(taskId);
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
