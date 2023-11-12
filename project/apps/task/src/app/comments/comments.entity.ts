import { Comment, DateString } from '@project/libs/shared-types';

export class CommentEntity implements Comment {
  public id?: string;
  public text: string;
  public taskId: string;
  public authorId: string;
  public createdAt: DateString;

  constructor(task: Comment) {
    this.fillEntity(task);
  }

  public toObject() {
    return { ...this };
  }

  private fillEntity(comment: Comment) {
    Object.assign(this, comment);
  }
}
