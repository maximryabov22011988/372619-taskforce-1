import { Review } from '@project/libs/shared-types';

export class ReviewEntity implements Review {
  id?: string;
  text: string;
  taskId: string;
  rating: number;

  constructor(review: Review) {
    this.fillEntity(review);
  }

  fillEntity(review: Review) {
    Object.assign(this, review);
  }

  toObject() {
    return { ...this };
  }
}
