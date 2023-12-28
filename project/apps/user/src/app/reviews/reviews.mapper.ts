import { fillObject } from '@project/libs/utils-core';
import { Review } from '@project/libs/shared-types';
import { ReviewModel } from '../../database/models/review.model';
import { ReviewRdo } from './rdo/review.rdo';

export const mapToReview = (comment: ReviewModel): Review =>
  fillObject(ReviewRdo, comment);
