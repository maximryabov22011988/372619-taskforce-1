import { Inject, Injectable } from '@nestjs/common';
import {
  ReviewModel,
  ReviewModelProperties,
} from '../../database/models/review.model';

@Injectable()
export class ReviewsRepository {
  constructor(
    @Inject(ReviewModel) private readonly reviewModel: typeof ReviewModel
  ) {}

  public async create(reviewData: ReviewModelProperties): Promise<ReviewModel> {
    return this.reviewModel.query().insert(reviewData).returning('*');
  }
}
