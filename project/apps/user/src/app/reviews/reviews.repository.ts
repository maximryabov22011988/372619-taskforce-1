import { Injectable } from '@nestjs/common';
import { Review } from '@project/libs/shared-types';
import { ReviewEntity } from './reviews.entity';

import { MemoryRepository } from '@project/services';

@Injectable()
export class ReviewsRepository extends MemoryRepository<
  Omit<ReviewEntity, 'toObject' | 'fillEntity'>,
  Review
> {}
