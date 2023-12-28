import { Injectable } from '@nestjs/common';
import { ReviewModel } from '../../database/models/review.model';
import { ReviewsRepository } from './reviews.repository';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private readonly reviewsRepository: ReviewsRepository) {}

  public async createReview(dto: CreateReviewDto): Promise<ReviewModel> {
    return this.reviewsRepository.create(dto);
  }
}
