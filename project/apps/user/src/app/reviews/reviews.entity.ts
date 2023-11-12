import { Review } from '@project/libs/shared-types';

export class ReviewEntity implements Review {
  public id?: string;
  public text: string;
  public taskId: string;
  public rating: number;

  constructor(review: Review) {
    this.fillEntity(review);
  }

  public toObject() {
    return { ...this };
  }

  private fillEntity(review: Review) {
    Object.assign(this, review);
  }
}
