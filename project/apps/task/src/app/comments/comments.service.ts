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

  public async findById(id: string): Promise<Comment> {
    const comment = await this.commentsRepository.findById(id);

    if (!comment) {
      throw new NotFoundException('Comment was not found');
    }

    return comment;
  }

  public async getComments(taskId: string): Promise<Comment[]> {
    const comments = await this.commentsRepository.findAll();
    return comments.filter((comment) => comment.taskId === taskId);
  }

  public async createComment(dto: CreateCommentDto): Promise<Comment> {
    const { text, taskId } = dto;

    const commentEntity = new CommentEntity({
      text,
      taskId,
      createdAt: this.dateTime.getDateTimeLocale(DateTimeService.UTC_FORMAT),
      authorId: '833a6872-29dd-4869-af2e-7df28a82aa6c',
    });

    return this.commentsRepository.create(commentEntity);
  }

  public async deleteComment(commentId: string): Promise<void> {
    await this.findById(commentId);
    await this.commentsRepository.delete(commentId);
  }

  public async deleteComments(taskId: string): Promise<void> {
    await this.commentsRepository.deleteComments(taskId);
  }
}
