import { Expose } from 'class-transformer';

export class ReviewRdo {
  @Expose()
  public id: string;

  @Expose()
  public taskId: string;

  @Expose()
  public rating: number;

  @Expose()
  public text: string;
}
