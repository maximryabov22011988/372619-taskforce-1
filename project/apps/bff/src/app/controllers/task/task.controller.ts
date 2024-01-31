import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigType } from '@nestjs/config';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiConsumes,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import FormData from 'form-data';
import pick from 'lodash/pick';
import assign from 'lodash/assign';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { BffConfig } from '@project/libs/config';
import {
  Category,
  Comment,
  ImageFile,
  RequestWithTokenPayload,
  Review,
  Task,
  TaskWithCustomer,
  TaskStatus,
  AvailableCityId,
  TaskStatusId,
} from '@project/libs/shared-types';
import {
  TaskSorting,
  TaskQuery,
  CommentQuery,
  MyTaskQuery,
} from '@project/libs/queries';
import {
  CreateTaskDto,
  CreateCategoryDto,
  CreateCommentDto,
  ChangeTaskStatusDto,
  SelectTaskContractorDto,
  CreateReviewDto,
} from '@project/libs/dto';
import {
  CategoryRdo,
  TaskRdo,
  CommentRdo,
  UploadedImageFileRdo,
  ReviewRdo,
  TaskItemRdo,
} from '@project/libs/rdo';
import { fillObject } from '@project/libs/utils-core';
import { HttpExceptionFilter } from '../../filters/http-exception.filter';
import { CheckAuthGuard } from '../../guards/check-auth.guard';
import { UserIdInterceptor } from '../../interceptors/user-id.interceptor';
import { TaskItemWithCustomerDataRdo } from './rdo/task-item-with-customer-data.rdo';
import { ApiAuth } from '@project/libs/decorators';

const { microserviceConfig } = BffConfig;

@UseFilters(HttpExceptionFilter)
@Controller('tasks')
@ApiTags('Task service')
export class TaskController {
  private readonly baseTasksUrl: string;
  private readonly baseCommentsUrl: string;
  private readonly baseCategoriesUrl: string;
  private readonly baseReviewsUrl: string;
  private readonly baseImageUploadUrl: string;
  private readonly baseUsersUrl: string;

  constructor(
    private readonly httpService: HttpService,
    @Inject(microserviceConfig.KEY)
    private readonly serviceConfig: ConfigType<typeof microserviceConfig>
  ) {
    const { taskServiceUrl, imageServiceUrl, userServiceUrl } =
      this.serviceConfig;

    this.baseTasksUrl = `${taskServiceUrl}/v1/tasks`;
    this.baseCommentsUrl = `${taskServiceUrl}/v1/comments`;
    this.baseCategoriesUrl = `${taskServiceUrl}/v1/categories`;
    this.baseReviewsUrl = `${taskServiceUrl}/v1/reviews`;
    this.baseImageUploadUrl = `${imageServiceUrl}/v1/image/upload`;
    this.baseUsersUrl = `${userServiceUrl}/v1/users`;
  }

  @UseGuards(CheckAuthGuard)
  @UseInterceptors(new UserIdInterceptor('authorId'))
  @Post('reviews')
  @ApiAuth()
  @ApiOperation({ summary: 'Creating new review' })
  @ApiCreatedResponse({
    description: 'New review has been successfully created',
    type: ReviewRdo,
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiNotFoundResponse({ description: 'Task was not found' })
  @ApiConflictResponse({ description: 'Review already exists' })
  public async createReview(
    @Body() dto: CreateReviewDto,
    @Req() req: Request & RequestWithTokenPayload
  ): Promise<Review> {
    const { data } = await this.httpService.axiosRef.post(
      this.baseReviewsUrl,
      dto,
      {
        headers: {
          Authorization: req.headers['authorization'],
        },
      }
    );

    return data;
  }

  @UseGuards(CheckAuthGuard)
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
  public async findAllNewTasks(
    @Query() query: TaskQuery,
    @Req() req: Request
  ): Promise<TaskWithCustomer[]> {
    const { data: tasks } = await this.httpService.axiosRef.get<Task[]>(
      `${this.baseTasksUrl}/new`,
      {
        params: query,
        headers: {
          Authorization: req.headers['authorization'],
        },
      }
    );

    const tasksWithCustomer: TaskWithCustomer[] = [];
    for (const task of tasks) {
      const { data: customer } = await this.httpService.axiosRef.get(
        `${this.baseUsersUrl}/${task.customerId}`,
        {
          headers: {
            Authorization: req.headers['authorization'],
          },
        }
      );

      tasksWithCustomer.push(
        fillObject(
          TaskItemWithCustomerDataRdo,
          assign(task, {
            customer: pick(customer, ['id', 'firstname', 'lastname', 'email']),
          })
        )
      );
    }

    return tasksWithCustomer;
  }

  @UseGuards(CheckAuthGuard)
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
    @Req() req: Request
  ): Promise<Task[]> {
    const { data } = await this.httpService.axiosRef.get<Task[]>(
      `${this.baseTasksUrl}/my`,
      {
        params: query,
        headers: {
          Authorization: req.headers['authorization'],
        },
      }
    );

    return data;
  }

  @UseGuards(CheckAuthGuard)
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
  public async findById(
    @Param('taskId') taskId: number,
    @Req() req: Request
  ): Promise<Task> {
    const { data } = await this.httpService.axiosRef.get(
      `${this.baseTasksUrl}/${taskId}`,
      {
        headers: {
          Authorization: req.headers['authorization'],
        },
      }
    );

    return data;
  }

  @UseGuards(CheckAuthGuard)
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
    @Req() req: Request
  ): Promise<Task> {
    const { data } = await this.httpService.axiosRef.post(
      this.baseTasksUrl,
      dto,
      {
        headers: {
          Authorization: req.headers['authorization'],
        },
      }
    );

    return data;
  }

  @UseGuards(CheckAuthGuard)
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
    @Req() req: Request
  ): Promise<Task> {
    const { data } = await this.httpService.axiosRef.patch(
      `${this.baseTasksUrl}/${taskId}/status`,
      dto,
      {
        headers: {
          Authorization: req.headers['authorization'],
        },
      }
    );

    return data;
  }

  @UseGuards(CheckAuthGuard)
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
  public async selectContractor(
    @Param('taskId') taskId: number,
    @Body() dto: SelectTaskContractorDto,
    @Req() req: Request
  ): Promise<void> {
    await this.httpService.axiosRef.patch(
      `${this.baseTasksUrl}/${taskId}/contractor`,
      dto,
      {
        headers: {
          Authorization: req.headers['authorization'],
        },
      }
    );
  }

  @UseGuards(CheckAuthGuard)
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
    @Req() req: Request
  ): Promise<void> {
    await this.httpService.axiosRef.patch(
      `${this.baseTasksUrl}/${taskId}/responses`,
      null,
      {
        headers: {
          Authorization: req.headers['authorization'],
        },
      }
    );
  }

  @UseGuards(CheckAuthGuard)
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
  public async deleteTask(
    @Param('taskId') taskId: number,
    @Req() req: Request
  ): Promise<void> {
    await this.httpService.axiosRef.delete(`${this.baseTasksUrl}/${taskId}`, {
      headers: {
        Authorization: req.headers['authorization'],
      },
    });
  }

  @UseGuards(CheckAuthGuard)
  @Post('categories')
  @ApiAuth()
  @ApiOperation({ summary: 'Creating new category' })
  @ApiCreatedResponse({
    description: 'New category has been successfully created',
    type: CategoryRdo,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public async createCategory(
    @Body() dto: CreateCategoryDto,
    @Req() req: Request
  ): Promise<Category> {
    const { data } = await this.httpService.axiosRef.post(
      `${this.baseCategoriesUrl}`,
      dto,
      {
        headers: {
          Authorization: req.headers['authorization'],
        },
      }
    );

    return data;
  }

  @UseGuards(CheckAuthGuard)
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
    @Query() query: CommentQuery,
    @Req() req: Request
  ): Promise<Comment[]> {
    const { data } = await this.httpService.axiosRef.get(
      `${this.baseTasksUrl}/${taskId}/comments`,
      {
        params: query,
        headers: {
          Authorization: req.headers['authorization'],
        },
      }
    );

    return data;
  }

  @UseGuards(CheckAuthGuard)
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
  public async deleteComments(
    @Param('taskId') taskId: number,
    @Req() req: Request
  ): Promise<void> {
    await this.httpService.axiosRef.delete(
      `${this.baseTasksUrl}/${taskId}/comments`,
      {
        headers: {
          Authorization: req.headers['authorization'],
        },
      }
    );
  }

  @UseGuards(CheckAuthGuard)
  @Post('comments')
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
    @Req() req: Request
  ): Promise<Comment> {
    const { data } = await this.httpService.axiosRef.post(
      this.baseCommentsUrl,
      dto,
      {
        headers: {
          Authorization: req.headers['authorization'],
        },
      }
    );

    return data;
  }

  @UseGuards(CheckAuthGuard)
  @Delete('comments/:commentId')
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
    @Req() req: Request
  ): Promise<void> {
    await this.httpService.axiosRef.delete(
      `${this.baseCommentsUrl}/${commentId}`,
      {
        headers: {
          Authorization: req.headers['authorization'],
        },
      }
    );
  }

  @UseGuards(CheckAuthGuard)
  @Get('new/notification')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiAuth()
  @ApiOperation({ summary: 'Notify contractors about new tasks' })
  @ApiNoContentResponse({
    description: 'All contractors have been successfully notified',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  public async sendNewTasksToContractors(@Req() req: Request): Promise<void> {
    await this.httpService.axiosRef.get(
      `${this.baseTasksUrl}/new/notification`,
      {
        headers: {
          Authorization: req.headers['authorization'],
        },
      }
    );
  }

  @UseGuards(CheckAuthGuard)
  @Post('upload/image')
  @UseInterceptors(FileInterceptor('file'))
  @ApiAuth()
  @ApiOperation({ summary: 'Uploading image' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiConsumes('multipart/form-data')
  @ApiOkResponse({
    description: 'Image file successfully uploaded',
    type: UploadedImageFileRdo,
  })
  @ApiBadRequestResponse({ description: 'Invalid image file size or format' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  public async uploadImage(
    @UploadedFile() file,
    @Req() req: Request
  ): Promise<ImageFile> {
    const form = new FormData();
    form.append('file', file.buffer, file.originalname);

    const { data } = await this.httpService.axiosRef.post(
      this.baseImageUploadUrl,
      form,
      {
        headers: {
          ...form.getHeaders(),
          Authorization: req.headers['authorization'],
        },
      }
    );

    return data;
  }
}
