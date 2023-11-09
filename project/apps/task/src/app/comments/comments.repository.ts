import { Injectable } from '@nestjs/common';
import { Comment } from '@project/libs/shared-types';
import { MemoryRepository } from '@project/services';
import { CommentEntity } from './comments.entity';

@Injectable()
export class CommentsRepository extends MemoryRepository<
  Omit<CommentEntity, 'toObject' | 'fillEntity'>,
  Comment
> {
  public async findAll(): Promise<Comment[]> {
    return Object.values(this.repository);
  }

  public async deleteComments(taskId: string) {
    Object.entries(this.repository).forEach(([id, comment]) => {
      if (comment.taskId === taskId) {
        delete this.repository[id];
      }
    });
  }
}
