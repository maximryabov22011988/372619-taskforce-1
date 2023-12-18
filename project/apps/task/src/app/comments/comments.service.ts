import { Injectable, NotFoundException } from '@nestjs/common';
import { DateTimeService } from '@project/services';
import { Comment } from '@project/libs/shared-types';
import { CommentsRepository } from './comments.repository';
import { CommentEntity } from './comments.entity';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    private readonly commentsRepository: CommentsRepository,
    private readonly dateTime: DateTimeService
  ) {}

  public async createComment(dto: CreateCommentDto): Promise<Comment> {
    const { text, taskId } = dto;

    const commentEntity = new CommentEntity({
      text,
      taskId,
      userId: '833a6872-29dd-4869-af2e-7df28a82aa6c',
      createdAt: this.dateTime.getDateTimeLocale(DateTimeService.UTC_FORMAT),
      updatedAt: this.dateTime.getDateTimeLocale(DateTimeService.UTC_FORMAT),
    });

    return this.commentsRepository.create(commentEntity);
  }

  public async deleteComment(commentId: number): Promise<void> {
    await this.findById(commentId);
    await this.commentsRepository.delete(commentId);
  }
  public async findAllForTask(taskId: number): Promise<Comment[]> {
    return this.commentsRepository.findAllForTask(taskId);
  }

  public async deleteAllForTask(taskId: number): Promise<void> {
    await this.commentsRepository.deleteAllForTask(taskId);
  }

  private async findById(commentId: number): Promise<Comment> {
    const comment = await this.commentsRepository.findById(commentId);
    if (!comment) {
      throw new NotFoundException('Comment was not found');
    }

    return comment;
  }
}
