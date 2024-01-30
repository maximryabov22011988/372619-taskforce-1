import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiNoContentResponse,
  ApiForbiddenResponse,
  ApiParam,
} from '@nestjs/swagger';
import {
  AvailableCityId,
  Comment,
  RequestWithTokenPayload,
  Task,
  TaskStatus,
  TaskStatusId,
  UserRoleId,
  Uuid,
} from '@project/libs/shared-types';
import { JwtAuthGuard, Roles, RolesGuard } from '@project/libs/validators';
import {
  CommentQuery,
  MyTaskQuery,
  TaskQuery,
  TaskSorting,
} from '@project/libs/queries';
import {
  ChangeTaskStatusDto,
  CreateTaskDto,
  SelectTaskContractorDto,
} from '@project/libs/dto';
import { CommentRdo, TaskRdo, TaskItemRdo } from '@project/libs/rdo';
import { CommentsService } from '../comments/comments.service';
import { mapToComment } from '../comments/comment-mapper';
import { NotifyService } from '../notify/notify.service';
import { isSameCustomerInterceptor } from './interceptors/is-same-customer.interceptor';
import { mapToTask } from './task-mapper';
import { TasksService } from './tasks.service';
import { mapToTaskItem } from './task-item-mapper';
import { ApiAuth } from '@project/libs/decorators';

@Controller({
  path: 'tasks',
  version: '1',
})
@ApiTags('Task service')
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
    private readonly commentsService: CommentsService,
    private readonly notifyService: NotifyService
  ) {}

  @Roles(UserRoleId.Contractor)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('new')
  @ApiAuth()
  @ApiOperation({
    summary: `Getting task list with status "${TaskStatus.New}"`,
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
    enum: TaskSorting,
    description: 'Selection by passed sort',
    required: false,
  })
  @ApiOkResponse({
    description: `Task list with status "${TaskStatus.New}" successfully received`,
    isArray: true,
    type: TaskItemRdo,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  public async findAllNewTasks(@Query() query: TaskQuery): Promise<Task[]> {
    const tasksModels = await this.tasksService.findAllByStatus(
      TaskStatusId.New,
      query
    );
    return tasksModels.map(mapToTaskItem);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my')
  @ApiAuth()
  @ApiOperation({
    summary: 'Getting my task list',
  })
  @ApiQuery({
    name: 'statusId',
    enum: TaskStatusId,
    description: 'Selection by status id',
    required: false,
  })
  @ApiOkResponse({
    description: 'My task list successfully received',
    isArray: true,
    type: TaskItemRdo,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  public async findTasksByUser(
    @Query() query: MyTaskQuery,
    @Req() req: RequestWithTokenPayload
  ): Promise<Task[]> {
    const { sub: userId, roleId } = req.user;

    const tasksModels = await this.tasksService.findOwn({
      userId,
      roleId,
      query,
    });

    return tasksModels.map(mapToTaskItem);
  }

  @UseGuards(JwtAuthGuard)
  @Get('customers/:customerId')
  @ApiAuth()
  @ApiOperation({
    summary: 'Getting published task count by customer',
  })
  @ApiParam({
    name: 'customerId',
    type: String,
    format: 'UUID',
  })
  @ApiOkResponse({
    description: 'Published task count by customer successfully received',
    type: Number,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  public async getTaskCountByCustomer(
    @Param('customerId', ParseUUIDPipe) customerId: Uuid
  ): Promise<number> {
    return this.tasksService.getTaskCountByCustomer(customerId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('new/customers/:customerId')
  @ApiAuth()
  @ApiOperation({
    summary: 'Getting new task count by customer',
  })
  @ApiParam({
    name: 'customerId',
    type: String,
    format: 'UUID',
  })
  @ApiOkResponse({
    description: 'New task count by customer successfully received',
    type: Number,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  public async getNewTaskCountByCustomer(
    @Param('customerId', ParseUUIDPipe) customerId: Uuid
  ): Promise<number> {
    return this.tasksService.getTaskCountByCustomer(
      customerId,
      TaskStatusId.New
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('done/contractors/:contractorId')
  @ApiAuth()
  @ApiOperation({
    summary: 'Getting completed task count by contractor',
  })
  @ApiParam({
    name: 'contractorId',
    type: String,
    format: 'UUID',
  })
  @ApiOkResponse({
    description: 'Completed task count by contractor successfully received',
    type: Number,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  public async getDoneTaskCountByContractor(
    @Param('contractorId', ParseUUIDPipe) contractorId: Uuid
  ): Promise<number> {
    return this.tasksService.getTaskCountByContractor(
      contractorId,
      TaskStatusId.Done
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('failed/contractors/:contractorId')
  @ApiAuth()
  @ApiOperation({
    summary: 'Getting failed task count by contractor',
  })
  @ApiParam({
    name: 'contractorId',
    type: String,
    format: 'UUID',
  })
  @ApiOkResponse({
    description: 'Failed task count by contractor successfully received',
    type: Number,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  public async getFailedTaskCountByContractor(
    @Param('contractorId', ParseUUIDPipe) contractorId: Uuid
  ): Promise<number> {
    return this.tasksService.getTaskCountByContractor(
      contractorId,
      TaskStatusId.Failed
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get(':taskId')
  @ApiAuth()
  @ApiOperation({ summary: 'Getting detailed information about task' })
  @ApiParam({
    name: 'taskId',
    type: Number,
  })
  @ApiOkResponse({
    description: 'Task details successfully received',
    type: TaskRdo,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not found' })
  public async findById(@Param('taskId') taskId: number): Promise<Task> {
    const taskModel = await this.tasksService.findById(taskId);
    return mapToTask(taskModel);
  }

  @Roles(UserRoleId.Customer)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  @ApiAuth()
  @ApiOperation({ summary: 'Creating new task' })
  @ApiCreatedResponse({
    description: 'New task has been successfully created',
    type: TaskRdo,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiNotFoundResponse({ description: 'City not found' })
  public async createTask(
    @Body() dto: CreateTaskDto,
    @Req() req: RequestWithTokenPayload
  ): Promise<Task> {
    const taskModel = await this.tasksService.createTask(dto, req.user.sub);
    const task = mapToTask(taskModel);

    return task;
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(isSameCustomerInterceptor)
  @Patch(':taskId/status')
  @ApiAuth()
  @ApiOperation({ summary: 'Change task status' })
  @ApiParam({
    name: 'taskId',
    type: Number,
  })
  @ApiOkResponse({
    description: 'Task status has been successfully changed',
    type: TaskRdo,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiNotFoundResponse({ description: 'Not found' })
  public async changeTaskStatus(
    @Param('taskId') taskId: number,
    @Body() dto: ChangeTaskStatusDto,
    @Req() req: RequestWithTokenPayload
  ): Promise<Task> {
    const taskModel = await this.tasksService.changeTaskStatus(
      taskId,
      dto,
      req.user
    );
    return mapToTask(taskModel);
  }

  @Roles(UserRoleId.Customer)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(isSameCustomerInterceptor)
  @Patch(':taskId/contractor')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiAuth()
  @ApiOperation({ summary: 'Select task contractor' })
  @ApiParam({
    name: 'taskId',
    type: Number,
  })
  @ApiNoContentResponse({
    description: 'Task contractor has been successfully selected',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiNotFoundResponse({ description: 'Not found' })
  public async selectTaskContractor(
    @Param('taskId') taskId: number,
    @Body() dto: SelectTaskContractorDto
  ): Promise<void> {
    await this.tasksService.selectTaskContractor(taskId, dto);
  }

  @Roles(UserRoleId.Contractor)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':taskId/responses')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiAuth()
  @ApiOperation({ summary: 'Respond to task' })
  @ApiParam({
    name: 'taskId',
    type: Number,
  })
  @ApiNoContentResponse({
    description: 'The response to the task was successful',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiNotFoundResponse({ description: 'Not found' })
  public async respondToTask(
    @Param('taskId') taskId: number,
    @Req() req: RequestWithTokenPayload
  ): Promise<void> {
    await this.tasksService.respondToTask(taskId, req.user.sub);
  }

  @Roles(UserRoleId.Customer)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':taskId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiAuth()
  @ApiOperation({ summary: 'Delete existing task' })
  @ApiParam({
    name: 'taskId',
    type: Number,
  })
  @ApiNoContentResponse({ description: 'Task has been successfully deleted' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiNotFoundResponse({ description: 'Not found' })
  public async deleteTask(@Param('taskId') taskId: number): Promise<void> {
    await this.tasksService.deleteTask(taskId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':taskId/comments')
  @ApiAuth()
  @ApiOperation({ summary: 'Getting task comment list' })
  @ApiParam({
    name: 'taskId',
    type: Number,
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
  @ApiOkResponse({
    description: 'Comment list successfully received',
    type: CommentRdo,
    isArray: true,
  })
  @ApiUnauthorizedResponse({
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
  @Delete(':taskId/comments')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiAuth()
  @ApiOperation({ summary: 'Deleting all comments belonging to the task' })
  @ApiParam({
    name: 'taskId',
    type: Number,
  })
  @ApiNoContentResponse({
    description: 'All task comments has been successfully deleted',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not found' })
  public async deleteComments(@Param('taskId') taskId: number): Promise<void> {
    await this.tasksService.findById(taskId);

    await this.commentsService.deleteAllForTask(taskId);
  }

  @Roles(UserRoleId.Contractor)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('new/notification')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiAuth()
  @ApiOperation({ summary: 'Notify contractors about new tasks' })
  @ApiNoContentResponse({
    description: 'All contractors have been successfully notified',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  public async sendNewTasksToContractors(): Promise<void> {
    const newTasksModels = await this.tasksService.findAllByStatus(
      TaskStatusId.New
    );
    const newTasks = newTasksModels.map(mapToTask);

    await this.notifyService.notifyNewTasks(newTasks);
  }
}
