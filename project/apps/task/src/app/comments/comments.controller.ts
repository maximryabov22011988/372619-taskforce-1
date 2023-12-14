import {
  Controller,
  Post,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { fillObject } from '@project/libs/utils-core';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentRdo } from './rdo/comment.rdo';

@ApiTags('Comment service')
@Controller({
  path: 'comments',
  version: '1',
})
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post('/')
  @ApiOperation({ summary: 'Creating new comment' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'New comment has been successfully created',
    type: CommentRdo,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  public async createComment(
    @Body() dto: CreateCommentDto
  ): Promise<CommentRdo> {
    const comment = await this.commentsService.createComment(dto);
    return fillObject(CommentRdo, comment);
  }

  @Delete('/:commentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deleting existing comment' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Comment has been successfully deleted',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  public async deleteComment(
    @Param('commentId', ParseIntPipe) commentId: number
  ): Promise<void> {
    await this.commentsService.deleteComment(commentId);
  }
}
