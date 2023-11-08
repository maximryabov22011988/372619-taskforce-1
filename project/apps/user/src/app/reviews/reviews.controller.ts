import { Controller, Post, Body } from '@nestjs/common';
import { fillObject } from '@project/libs/utils-core';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewRdo } from './rdo/review.rdo';

@Controller({
  path: 'reviews',
  version: '1',
})
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post('/')
  public async createReview(@Body() dto: CreateReviewDto): Promise<ReviewRdo> {
    const review = await this.reviewsService.createReview(dto);
    return fillObject(ReviewRdo, review);
  }
}
