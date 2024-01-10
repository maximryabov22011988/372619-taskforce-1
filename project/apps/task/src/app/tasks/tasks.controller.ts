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
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { AvailableCityId, Comment, Task } from '@project/libs/shared-types';
import { JwtAuthGuard } from '@project/libs/validators';
import { CommentsService } from '../comments/comments.service';
import { CommentRdo } from '../comments/rdo/comment.rdo';
import { mapToComment } from '../comments/comments.mapper';
import { CommentQuery } from '../comments/comments.query';
import { NotifyService } from '../notify/notify.service';
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
    private readonly notifyService: NotifyService
  ) {}

  @UseGuards(JwtAuthGuard)
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
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Task details',
    isArray: true,
    type: TaskRdo,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  public async findAll(@Query() query: TaskQuery): Promise<Task[]> {
    const tasksModels = await this.tasksService.findAll(query);
    return tasksModels.map(mapToTask);
  }

  @UseGuards(JwtAuthGuard)
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
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  public async findById(@Param('taskId') taskId: number): Promise<Task> {
    const taskModel = await this.tasksService.findById(taskId);
    return mapToTask(taskModel);
  }

  @UseGuards(JwtAuthGuard)
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
    const task = mapToTask(taskModel);

    await this.notifyService.registerSubscriber({
      userId: task.customerId,
      title: task.title,
      description: task.description,
      city: task.city,
      price: task.price,
    });

    return task;
  }

  @UseGuards(JwtAuthGuard)
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
    @Param('taskId') taskId: number,
    @Body() dto: UpdateTaskDto
  ): Promise<Task> {
    const taskModel = await this.tasksService.updateTask(taskId, dto);
    return mapToTask(taskModel);
  }

  @UseGuards(JwtAuthGuard)
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
  public async deleteTask(@Param('taskId') taskId: number): Promise<void> {
    await this.tasksService.deleteTask(taskId);
  }

  @UseGuards(JwtAuthGuard)
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
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  public async findAllForTask(
    @Param('taskId') taskId: number,
    @Query() query: CommentQuery
  ): Promise<Comment[]> {
    await this.tasksService.findById(taskId);

    const commentsModels = await this.commentsService.findAllForTask(
      taskId,
      query
    );

    return commentsModels.map(mapToComment);
  }

  @UseGuards(JwtAuthGuard)
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
  public async deleteComments(@Param('taskId') taskId: number): Promise<void> {
    await this.tasksService.findById(taskId);

    await this.commentsService.deleteAllForTask(taskId);
  }
}
