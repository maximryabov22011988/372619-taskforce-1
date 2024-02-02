import {
  Controller,
  Post,
  Delete,
  Body,
  Param,
  Req,
  HttpCode,
  HttpStatus,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiNoContentResponse,
} from '@nestjs/swagger';
import { Comment, RequestWithTokenPayload } from '@project/libs/shared-types';
import { JwtAuthGuard } from '@project/libs/validators';
import { CreateCommentDto } from '@project/libs/dto';
import { CommentRdo } from '@project/libs/rdo';
import { ApiAuth } from '@project/libs/decorators';
import { mapToComment } from './comment-mapper';
import { CommentsService } from './comments.service';

@Controller({
  path: 'comments',
  version: '1',
})
@ApiTags('Comment service')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiAuth()
  @ApiOperation({ summary: 'Creating new comment' })
  @ApiCreatedResponse({
    description: 'New comment has been successfully created',
    type: CommentRdo,
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  public async createComment(
    @Body() dto: CreateCommentDto,
    @Req() req: RequestWithTokenPayload
  ): Promise<Comment> {
    console.log(
      '%c DEBUG CommentsController create',
      'padding: 0.3rem 0.5rem 0.3rem 0.4rem; background: red; font: 12px/1 Arial; color: white; border-radius: 2px'
    );
    const commentModel = await this.commentsService.createComment(
      dto,
      req.user.sub
    );
    return mapToComment(commentModel);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':commentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiAuth()
  @ApiOperation({ summary: 'Deleting existing comment' })
  @ApiNoContentResponse({
    description: 'Comment has been successfully deleted',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiNotFoundResponse({ description: 'Not found' })
  public async deleteComment(
    @Param('commentId') commentId: number,
    @Req() req: RequestWithTokenPayload
  ): Promise<void> {
    const commentModel = await this.commentsService.findById(commentId);
    if (commentModel.authorId !== req.user.sub) {
      throw new ForbiddenException(
        "Deleting other people's comments is forbidden"
      );
    }

    await this.commentsService.deleteComment(commentId);
  }
}
