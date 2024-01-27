import {
  Controller,
  Post,
  Body,
  HttpStatus,
  UseGuards,
  Req,
  Get,
  Param,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  RequestWithTokenPayload,
  Review,
  UserRoleId,
} from '@project/libs/shared-types';
import { JwtAuthGuard, Roles, RolesGuard } from '@project/libs/validators';
import { CreateReviewDto } from '@project/libs/dto';
import { ReviewRdo } from '@project/libs/rdo';
import { ReviewsService } from './reviews.service';
import { mapToReview } from './review-mapper';

@ApiTags('Review service')
@Controller({
  path: 'reviews',
  version: '1',
})
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Roles(UserRoleId.Customer)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  @ApiOperation({ summary: 'Creating new review' })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Review already exists',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'New review has been successfully created',
    type: ReviewRdo,
  })
  public async createReview(
    @Body() dto: CreateReviewDto,
    @Req() req: RequestWithTokenPayload
  ): Promise<Review> {
    const reviewModel = await this.reviewsService.createReview(
      dto,
      req.user.sub
    );

    return mapToReview(reviewModel);
  }

  @UseGuards(JwtAuthGuard)
  @Get('contractors/:contractorId/rating')
  @ApiOperation({ summary: 'Getting contractor rating' })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Contractor rating',
    type: Number,
  })
  public async getContractorRating(
    @Param('contractorId') contractorId: string
  ): Promise<number> {
    return this.reviewsService.getContractorRating(contractorId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('contractors/:contractorId/rating-level')
  @ApiOperation({ summary: 'Getting contractor rating level' })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Contractor rating level',
    type: Number,
  })
  public async getContractorRatingLevel(
    @Param('contractorId') contractorId: string
  ): Promise<number> {
    return this.reviewsService.getContractorRatingLevel(contractorId);
  }
}
