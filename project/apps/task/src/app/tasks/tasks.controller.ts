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
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
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

  @Roles(UserRoleId.Contractor)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('new')
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
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: `Task list with status "${TaskStatus.New}"`,
    isArray: true,
    type: TaskItemRdo,
  })
  public async findAllNewTasks(@Query() query: TaskQuery): Promise<Task[]> {
    const tasksModels = await this.tasksService.findAllByStatus(
      TaskStatusId.New,
      query
    );
    return tasksModels.map(mapToTaskItem);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my')
  @ApiOperation({
    summary: 'Getting my task list',
  })
  @ApiQuery({
    name: 'statusId',
    enum: AvailableCityId,
    description: 'Selection by status id',
    required: false,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'My task list',
    isArray: true,
    type: TaskItemRdo,
  })
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
  @ApiOperation({
    summary: 'Getting published task count by customer',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Published task count by customer',
    type: Number,
  })
  public async getTaskCountByCustomer(
    @Param('customerId', ParseUUIDPipe) customerId: Uuid
  ): Promise<number> {
    return this.tasksService.getTaskCountByCustomer(customerId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('new/customers/:customerId')
  @ApiOperation({
    summary: 'Getting new task count by customer',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'New task count by customer',
    type: Number,
  })
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
  @ApiOperation({
    summary: 'Getting completed task count by contractor',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Completed task count by contractor',
    type: Number,
  })
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
  @ApiOperation({
    summary: 'Getting failed task count by contractor',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Failed task count by contractor',
    type: Number,
  })
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
  @ApiOperation({ summary: 'Getting detailed information about task' })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not found',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Task details',
    type: TaskRdo,
  })
  public async findById(@Param('taskId') taskId: number): Promise<Task> {
    const taskModel = await this.tasksService.findById(taskId);
    return mapToTask(taskModel);
  }

  @Roles(UserRoleId.Customer)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  @ApiOperation({ summary: 'Creating new task' })
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
    description: 'City not found',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'New task has been successfully created',
    type: TaskRdo,
  })
  public async createTask(
    @Body() dto: CreateTaskDto,
    @Req() req: RequestWithTokenPayload
  ): Promise<Task> {
    const taskModel = await this.tasksService.createTask(dto, req.user.sub);
    const task = mapToTask(taskModel);

    // await this.notifyService.registerSubscriber({
    //   userId: task.customerId,
    //   title: task.title,
    //   description: task.description,
    //   city: task.city,
    //   price: task.price,
    // });

    return task;
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(isSameCustomerInterceptor)
  @Patch(':taskId/status')
  @ApiOperation({ summary: 'Change task status' })
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
    status: HttpStatus.OK,
    description: 'Task status has been successfully changed',
    type: TaskRdo,
  })
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
  @ApiOperation({ summary: 'Select task contractor' })
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
    description: 'Task contractor has been successfully selected',
  })
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
  @ApiOperation({ summary: 'Respond to task' })
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
    description: 'The response to the task was successful',
  })
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
  @ApiOperation({ summary: 'Delete existing task' })
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
    description: 'Task has been successfully deleted',
  })
  public async deleteTask(@Param('taskId') taskId: number): Promise<void> {
    await this.tasksService.deleteTask(taskId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':taskId/comments')
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
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Comment list',
    type: CommentRdo,
    isArray: true,
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
  @ApiOperation({ summary: 'Deleting all comments belonging to the task' })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not found',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'All comments has been successfully deleted',
  })
  public async deleteComments(@Param('taskId') taskId: number): Promise<void> {
    await this.tasksService.findById(taskId);

    await this.commentsService.deleteAllForTask(taskId);
  }

  @Roles(UserRoleId.Contractor)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('new/notification')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Notify contractors about new tasks',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'All contractors have been successfully notified',
  })
  public async sendNewTasksToContractors(): Promise<void> {
    const newTasksModels = await this.tasksService.findAllByStatus(
      TaskStatusId.New
    );
    const newTasks = newTasksModels.map(mapToTask);

    await this.notifyService.notifyNewTasks(newTasks);
  }
}
