import { fillObject } from '@project/libs/utils-core';
import { Comment } from '@project/libs/shared-types';
import { CommentRdo } from '@project/libs/rdo';
import { CommentModel } from '../../database/models/comment.model';

export const mapToComment = (comment: CommentModel): Comment =>
  fillObject(CommentRdo, comment);
