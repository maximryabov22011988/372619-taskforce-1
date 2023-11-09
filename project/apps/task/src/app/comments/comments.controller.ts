import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { fillObject } from '@project/libs/utils-core';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentRdo } from './rdo/comment.rdo';

@Controller({
  path: 'comments',
  version: '1',
})
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get(':taskId')
  public async getCommentList(
    @Param('taskId') taskId: string
  ): Promise<CommentRdo[]> {
    const comments = await this.commentsService.getComments(taskId);
    return comments.map((comment) => fillObject(CommentRdo, comment));
  }

  @Post('/')
  public async createComment(
    @Body() dto: CreateCommentDto
  ): Promise<CommentRdo> {
    const comment = await this.commentsService.createComment(dto);
    return fillObject(CommentRdo, comment);
  }

  @Delete(':taskId/:commentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deleteComment(
    @Param('commentId') commentId: string
  ): Promise<void> {
    await this.commentsService.deleteComment(commentId);
  }

  @Delete(':taskId/')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deleteComments(@Param('taskId') taskId: string): Promise<void> {
    await this.commentsService.deleteComments(taskId);
  }
}
