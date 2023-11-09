import { Expose } from 'class-transformer';

export class CommentRdo {
  @Expose()
  public id?: string;

  @Expose()
  public text: string;

  @Expose()
  public authorId: string;

  @Expose()
  public taskId: string;
}
