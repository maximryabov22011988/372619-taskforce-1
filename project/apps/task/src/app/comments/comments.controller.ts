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
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  Comment,
  RequestWithTokenPayload,
  UserRoleId,
} from '@project/libs/shared-types';
import { JwtAuthGuard, Roles, RolesGuard } from '@project/libs/validators';
import { CreateCommentDto } from '@project/libs/dto';
import { CommentRdo } from '@project/libs/rdo';
import { mapToComment } from './comment-mapper';
import { CommentsService } from './comments.service';

@ApiTags('Comment service')
@Controller({
  path: 'comments',
  version: '1',
})
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Creating new comment' })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'New comment has been successfully created',
    type: CommentRdo,
  })
  public async createComment(
    @Body() dto: CreateCommentDto,
    @Req() req: RequestWithTokenPayload
  ): Promise<Comment> {
    const commentModel = await this.commentsService.createComment(
      dto,
      req.user.sub
    );
    return mapToComment(commentModel);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':commentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deleting existing comment' })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not found',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Comment has been successfully deleted',
  })
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
