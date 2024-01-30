import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiTags,
  ApiCreatedResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiConflictResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import {
  RequestWithTokenPayload,
  Review,
  UserRoleId,
  Uuid,
} from '@project/libs/shared-types';
import { ApiAuth } from '@project/libs/decorators';
import { JwtAuthGuard, Roles, RolesGuard } from '@project/libs/validators';
import { CreateReviewDto } from '@project/libs/dto';
import { ReviewRdo } from '@project/libs/rdo';
import { ReviewsService } from './reviews.service';
import { mapToReview } from './review-mapper';

@Controller({
  path: 'reviews',
  version: '1',
})
@ApiTags('Review service')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Roles(UserRoleId.Customer)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  @ApiAuth()
  @ApiOperation({ summary: 'Creating new review' })
  @ApiCreatedResponse({
    description: 'New review has been successfully created',
    type: ReviewRdo,
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiNotFoundResponse({ description: 'Task was not found' })
  @ApiConflictResponse({ description: 'Review already exists' })
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
  @ApiAuth()
  @ApiOperation({ summary: 'Getting contractor rating' })
  @ApiOkResponse({
    description: 'Contractor rating successfully received',
    type: Number,
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  public async getContractorRating(
    @Param('contractorId', ParseUUIDPipe) contractorId: Uuid
  ): Promise<number> {
    return this.reviewsService.getContractorRating(contractorId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('contractors/:contractorId/rating-level')
  @ApiAuth()
  @ApiOperation({ summary: 'Getting contractor rating level' })
  @ApiOkResponse({
    description: 'Contractor rating level successfully received',
    type: Number,
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  public async getContractorRatingLevel(
    @Param('contractorId', ParseUUIDPipe) contractorId: Uuid
  ): Promise<number> {
    return this.reviewsService.getContractorRatingLevel(contractorId);
  }
}
