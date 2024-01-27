import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import uniq from 'lodash/uniq';
import orderBy from 'lodash/orderBy';
import { CreateReviewDto } from '@project/libs/dto';
import { TaskStatus, TaskStatusId, Uuid } from '@project/libs/shared-types';
import { ReviewModel } from '../../database/models/review.model';
import { TasksService } from '../tasks/tasks.service';
import { ReviewsRepository } from './reviews.repository';

@Injectable()
export class ReviewsService {
  constructor(
    private readonly reviewsRepository: ReviewsRepository,
    private readonly tasksService: TasksService
  ) {}

  public async createReview(
    dto: CreateReviewDto,
    authorId: Uuid
  ): Promise<ReviewModel> {
    const taskModel = await this.tasksService.findById(dto.taskId);

    if (
      dto.customerId !== authorId ||
      dto.contractorId !== taskModel.contractorId
    ) {
      throw new ForbiddenException(
        'Reviews could be created for your tasks contractors'
      );
    }

    if (taskModel.statusId !== TaskStatusId.Done) {
      throw new BadRequestException(
        `Reviews could be created only for tasks with status "${TaskStatus.Done}"`
      );
    }

    const existedReviewModel = await this.findReviewByTaskId(dto.taskId);
    if (existedReviewModel) {
      throw new ConflictException('Reviews already exists');
    }

    return this.reviewsRepository.create({
      ...dto,
      authorId,
    });
  }

  public async getContractorRating(contractorId: Uuid): Promise<number> {
    const reviewModels = await this.reviewsRepository.findByContractorId(
      contractorId
    );

    const reviewsCount = reviewModels.length;
    const ratingSum = reviewModels.reduce((result, reviewModel) => {
      result += reviewModel.rating;
      return result;
    }, 0);
    const failedTasksCount = await this.tasksService.getTaskCountByContractor(
      contractorId,
      TaskStatusId.Failed
    );

    return parseFloat(
      (ratingSum / (reviewsCount + failedTasksCount)).toFixed(2)
    );
  }

  public async getContractorRatingLevel(contractorId: Uuid): Promise<number> {
    const reviewsModels = await this.reviewsRepository.findAll();
    const contractorsIds = uniq(
      reviewsModels.map((reviewModel) => reviewModel.contractorId)
    );

    const contractorsRating: { id: Uuid; rating: number }[] = [];
    for (const id of contractorsIds) {
      const rating = await this.getContractorRating(id);
      contractorsRating.push({
        id,
        rating,
      });
    }

    const orderedContractorsRating = orderBy(
      contractorsRating,
      ['rating'],
      ['desc']
    );
    const foundIndex = orderedContractorsRating.findIndex(
      ({ id }) => id === contractorId
    );

    return foundIndex + 1;
  }

  private async findReviewByTaskId(taskId: number): Promise<ReviewModel> {
    return this.reviewsRepository.findByTaskId(taskId);
  }
}
