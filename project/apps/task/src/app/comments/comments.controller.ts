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

  @Get(':taskId')
  @ApiOperation({ summary: 'Getting task comment list' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Comment list',
    type: CommentRdo,
    isArray: true,
  })
  public async getCommentList(
    @Param('taskId') taskId: string
  ): Promise<CommentRdo[]> {
    const comments = await this.commentsService.getComments(taskId);
    return comments.map((comment) => fillObject(CommentRdo, comment));
  }

  @Delete(':taskId/:commentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deleting all comments belonging to the task' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'All comments has been successfully deleted',
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
    @Param('commentId') commentId: string
  ): Promise<void> {
    await this.commentsService.deleteComment(commentId);
  }

  @Delete(':taskId/')
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
  public async deleteComments(@Param('taskId') taskId: string): Promise<void> {
    await this.commentsService.deleteComments(taskId);
  }
}
