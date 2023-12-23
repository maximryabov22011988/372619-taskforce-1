import { Comment, Entity } from '@project/libs/shared-types';

export class CommentEntity implements Entity<CommentEntity>, Comment {
  public id?: number;
  public text: string;
  public taskId: number;
  public userId: string;

  constructor(task: Comment) {
    this.fillEntity(task);
  }

  public toObject(): CommentEntity {
    return { ...this };
  }

  public fillEntity(comment: Comment) {
    Object.assign(this, comment);
  }
}
