import { Inject, Injectable } from '@nestjs/common';
import { Uuid } from '@project/libs/shared-types';
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

  public async findAll(): Promise<ReviewModel[]> {
    return this.reviewModel.query().select('*').execute();
  }

  public async findByTaskId(taskId: number): Promise<ReviewModel> {
    return this.reviewModel.query().where({ taskId }).returning('*').first();
  }

  public async findByContractorId(contractorId: Uuid): Promise<ReviewModel[]> {
    return this.reviewModel
      .query()
      .where({ contractorId })
      .returning('*')
      .execute();
  }
}
