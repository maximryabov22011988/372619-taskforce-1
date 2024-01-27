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
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import FormData from 'form-data';
import pick from 'lodash/pick';
import assign from 'lodash/assign';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiGatewayConfig } from '@project/libs/config';
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
} from '@project/libs/rdo';
import { fillObject } from '@project/libs/utils-core';
import { HttpExceptionFilter } from '../../filters/http-exception.filter';
import { CheckAuthGuard } from '../../guards/check-auth.guard';
import { UserIdInterceptor } from '../../interceptors/user-id.interceptor';
import { TaskItemWithCustomerDataRdo } from './rdo/task-item-with-customer-data.rdo';
import { TaskItemRdo } from 'apps/task/src/app/tasks/rdo/task-item.rdo';

const { microserviceConfig } = ApiGatewayConfig;

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
  @ApiOperation({ summary: 'Creating new review' })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Task not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'New review has been successfully created',
    type: ReviewRdo,
  })
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
  @ApiOperation({
    summary: `Getting task list with status "${TaskStatus.New}"`,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: `Task list with status "${TaskStatus.New}"`,
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
    description: 'Task details',
    isArray: true,
    type: TaskItemWithCustomerDataRdo,
  })
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

    const data: TaskWithCustomer[] = [];
    for (const task of tasks) {
      const { data: customer } = await this.httpService.axiosRef.get(
        `${this.baseUsersUrl}/${task.customerId}`,
        {
          headers: {
            Authorization: req.headers['authorization'],
          },
        }
      );

      data.push(
        fillObject(
          TaskItemWithCustomerDataRdo,
          assign(task, {
            customer: pick(customer, ['id', 'firstname', 'lastname', 'email']),
          })
        )
      );
    }

    return data;
  }

  @UseGuards(CheckAuthGuard)
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
  @ApiOperation({ summary: 'Creating new task' })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
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
  @ApiOperation({ summary: 'Update existing task' })
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
  @ApiOperation({ summary: 'Delete existing task' })
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
    description: 'Task has been successfully deleted',
  })
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
  @ApiOperation({ summary: 'Creating new category' })
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
    description: 'New category has been successfully created',
    type: CategoryRdo,
  })
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
  @ApiOperation({ summary: 'Creating new comment' })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'New comment has been successfully created',
    type: CommentRdo,
  })
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
  @ApiOperation({ summary: 'Deleting existing comment' })
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
    description: 'Comment has been successfully deleted',
  })
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
  @Post('upload/image')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Uploading task image' })
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
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Image file is successfully uploaded',
    type: UploadedImageFileRdo,
  })
  @ApiConsumes('multipart/form-data')
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
