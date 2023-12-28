import { Controller, Post, Body, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Review } from '@project/libs/shared-types';
import { ReviewsService } from './reviews.service';
import { mapToReview } from './reviews.mapper';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewRdo } from './rdo/review.rdo';

@ApiTags('Review service')
@Controller({
  path: 'reviews',
  version: '1',
})
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post('/')
  @ApiOperation({ summary: 'Creating new review' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'New review has been successfully created',
    type: ReviewRdo,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  public async createReview(@Body() dto: CreateReviewDto): Promise<Review> {
    const reviewModel = await this.reviewsService.createReview(dto);
    return mapToReview(reviewModel);
  }
}
