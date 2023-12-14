import { Review, Entity } from '@project/libs/shared-types';

export class ReviewEntity implements Entity<ReviewEntity>, Review {
  public id?: number;
  public text: string;
  public taskId: number;
  public rating: number;

  constructor(review: Review) {
    this.fillEntity(review);
  }

  public toObject() {
    return { ...this };
  }

  public fillEntity(review: Review) {
    Object.assign(this, review);
  }
}
