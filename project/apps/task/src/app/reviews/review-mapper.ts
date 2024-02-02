import { fillObject } from '@project/libs/utils-core';
import { Review } from '@project/libs/shared-types';
import { ReviewRdo } from '@project/libs/rdo';
import { ReviewModel } from '../../database/models/review.model';

export const mapToReview = (comment: ReviewModel): Review =>
  fillObject(ReviewRdo, comment);
