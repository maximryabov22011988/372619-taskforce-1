import { Entity } from '@project/libs/shared-types';
import { CommentModelProperties } from '../../database/models/comment.model';

export class CommentEntity implements Entity<CommentEntity> {
  public id?: number;
  public text: string;
  public taskId: number;

  constructor(task: CommentModelProperties) {
    this.fillEntity(task);
  }

  public toObject(): CommentEntity {
    return { ...this };
  }

  public fillEntity(comment: CommentModelProperties) {
    Object.assign(this, comment);
  }
}
