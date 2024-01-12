import { fillObject } from '@project/libs/utils-core';
import { Comment } from '@project/libs/shared-types';
import { CommentModel } from '../../database/models/comment.model';
import { CommentRdo } from './rdo/comment.rdo';

export const mapToComment = (comment: CommentModel): Comment =>
  fillObject(CommentRdo, comment);
