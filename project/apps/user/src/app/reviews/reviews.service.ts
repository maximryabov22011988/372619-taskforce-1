import { Injectable } from '@nestjs/common';
import { Review } from '@project/libs/shared-types';
import { ReviewsRepository } from './reviews.repository';
import { ReviewEntity } from './reviews.entity';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private readonly reviewsRepository: ReviewsRepository) {}

  public async createReview(dto: CreateReviewDto): Promise<Review> {
    const reviewEntity = new ReviewEntity({ ...dto });
    return this.reviewsRepository.create(reviewEntity);
  }
}
