import {
  Controller,
  Query,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { DateTimeService } from '@project/services';
import { AvailableCityId, Comment, Task } from '@project/libs/shared-types';
import { CommentsService } from '../comments/comments.service';
import { CommentRdo } from '../comments/rdo/comment.rdo';
import { mapToComment } from '../comments/comments.mapper';
import { CommentQuery } from '../comments/comments.query';
import { mapToTask } from '../tasks/tasks.mapper';
import { TasksService } from './tasks.service';
import { Sorting, TaskQuery } from './tasks.query';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskRdo } from './rdo/task.rdo';

@ApiTags('Task service')
@Controller({
  path: 'tasks',
  version: '1',
})
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
    private readonly commentsService: CommentsService,
    private readonly dateTimeService: DateTimeService
  ) {}

  @Get('/')
  @ApiOperation({ summary: 'Getting task list' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Task list',
    type: TaskRdo,
    isArray: true,
  })
  @ApiQuery({
    name: 'page',
    type: Number,
    description: 'Page number. It is used for paginating',
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    description: 'Max limit records',
    required: false,
  })
  @ApiQuery({
    name: 'categoryId',
    type: Number,
    description: 'Selection by category id',
    required: false,
  })
  @ApiQuery({
    name: 'tagId',
    type: Number,
    description: 'Selection by tag id',
    required: false,
  })
  @ApiQuery({
    name: 'cityId',
    enum: AvailableCityId,
    description: 'Selection by city id',
    required: false,
  })
  @ApiQuery({
    name: 'sorting',
    enum: Sorting,
    description: 'Selection by passed sort',
    required: false,
  })
  public async findAll(@Query() query: TaskQuery): Promise<Task[]> {
    const tasksModels = await this.tasksService.findAll(query);
    return tasksModels.map(mapToTask);
  }

  @Get('/:taskId')
  @ApiOperation({ summary: 'Getting detailed information about task' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Task details',
    type: TaskRdo,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not found',
  })
  public async findById(
    @Param('taskId', ParseIntPipe) taskId: number
  ): Promise<Task> {
    const taskModel = await this.tasksService.findById(taskId);
    return mapToTask(taskModel);
  }

  @Post('/')
  @ApiOperation({ summary: 'Creating new task' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'New task has been successfully created',
    type: TaskRdo,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  public async createTask(@Body() dto: CreateTaskDto): Promise<Task> {
    const taskModel = await this.tasksService.createTask(dto);
    return mapToTask(taskModel);
  }

  @Patch('/:taskId')
  @ApiOperation({ summary: 'Update existing task' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Task has been successfully updated',
    type: TaskRdo,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not found',
  })
  public async updateTask(
    @Param('taskId', ParseIntPipe) taskId: number,
    @Body() dto: UpdateTaskDto
  ): Promise<Task> {
    const taskModel = await this.tasksService.updateTask(taskId, dto);
    return mapToTask(taskModel);
  }

  @Delete('/:taskId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete existing task' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Task has been successfully deleted',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  public async deleteTask(
    @Param('taskId', ParseIntPipe) taskId: number
  ): Promise<void> {
    await this.tasksService.deleteTask(taskId);
  }

  @Get('/:taskId/comments')
  @ApiOperation({ summary: 'Getting task comment list' })
  @ApiQuery({
    name: 'page',
    type: Number,
    description: 'Page number. It is used for paginating',
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    description: 'Max limit records',
    required: false,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Comment list',
    type: CommentRdo,
    isArray: true,
  })
  public async findAllForTask(
    @Param('taskId', ParseIntPipe) taskId: number,
    @Query() query: CommentQuery
  ): Promise<Comment[]> {
    await this.tasksService.findById(taskId);

    const commentsModels = await this.commentsService.findAllForTask(
      taskId,
      query
    );

    return commentsModels.map(mapToComment);
  }

  @Delete('/:taskId/comments')
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
  public async deleteComments(
    @Param('taskId', ParseIntPipe) taskId: number
  ): Promise<void> {
    await this.tasksService.findById(taskId);

    await this.commentsService.deleteAllForTask(taskId);
  }
}
