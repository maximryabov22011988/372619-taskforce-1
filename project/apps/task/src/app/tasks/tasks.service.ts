import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DateTimeService } from '@project/libs/services';
import {
  AccessTokenPayload,
  TaskStatus,
  TaskStatusId,
  UserRoleId,
  Uuid,
} from '@project/libs/shared-types';
import { TaskQuery } from '@project/libs/queries';
import {
  ChangeTaskStatusDto,
  CreateTaskDto,
  SelectTaskContractorDto,
} from '@project/libs/dto';
import {
  TaskModel,
  TaskModelProperties,
} from '../../database/models/task.model';
import { CategoriesService } from '../categories/categories.service';
import { TagsService } from '../tags/tags.service';
import { CitiesService } from '../cities/cities.service';
import { FindMyTasksParams, TasksRepository } from './tasks.repository';

@Injectable()
export class TasksService {
  constructor(
    private readonly tasksRepository: TasksRepository,
    private readonly categoriesService: CategoriesService,
    private readonly tagsService: TagsService,
    private readonly citiesService: CitiesService,
    private readonly dateTimeService: DateTimeService
  ) {}

  public async findById(taskId: number): Promise<TaskModel> {
    const taskModel = await this.tasksRepository.findById(taskId);
    if (!taskModel) {
      throw new NotFoundException('Task was not found');
    }

    return taskModel;
  }

  public async findAllByStatus(
    statusId: TaskStatusId,
    query?: TaskQuery
  ): Promise<TaskModel[]> {
    return this.tasksRepository.findAllByStatus(statusId, query);
  }

  public async findOwn({
    userId,
    roleId,
    query,
  }: FindMyTasksParams): Promise<TaskModel[]> {
    return this.tasksRepository.findOwn({
      userId,
      roleId,
      query,
    });
  }

  public async getTaskCountByCustomer(
    customerId: Uuid,
    statusId?: TaskStatusId
  ): Promise<number> {
    const tasksModels = await this.tasksRepository.findAllByCustomerAndStatus(
      customerId,
      statusId
    );

    return tasksModels.length;
  }

  public async getTaskCountByContractor(
    contractorId: Uuid,
    statusId: TaskStatusId
  ): Promise<number> {
    const tasksModels = await this.tasksRepository.findAllByContractorAndStatus(
      contractorId,
      statusId
    );

    return tasksModels.length;
  }

  public async createTask(
    dto: CreateTaskDto,
    customerId: Uuid
  ): Promise<TaskModel> {
    await this.citiesService.findById(dto.cityId);

    let categoryModel = await this.categoriesService.getCategory(dto.category);
    if (!categoryModel) {
      categoryModel = await this.categoriesService.createCategory({
        name: dto.category,
      });
    }

    const createdTaskModel = await this.tasksRepository.create({
      title: dto.title,
      description: dto.description,
      price: dto.price ?? 0,
      executionDate: this.getExecutionDate(dto.executionDate),
      imageUrl: dto.imageUrl ?? '',
      address: dto.address ?? '',
      categoryId: categoryModel.id,
      cityId: dto.cityId,
      statusId: TaskStatusId.New,
      customerId,
      contractorId: null,
      responses: [],
    });

    await this.tagsService.createTags(dto.tags ?? [], createdTaskModel.id);

    return this.findById(createdTaskModel.id);
  }

  public async deleteTask(taskId: number): Promise<void> {
    await this.findById(taskId);
    await this.tasksRepository.delete(taskId);
  }

  public async respondToTask(taskId: number, userId: Uuid): Promise<void> {
    const taskModel = await this.findById(taskId);

    if (taskModel.statusId !== TaskStatusId.New) {
      throw new BadRequestException(
        `You can only respond to a task with the status "${TaskStatus.New}"`
      );
    }

    await this.tasksRepository.update(taskId, {
      ...this.getUpdatedTaskData(taskModel),
      responses: [...taskModel.responses, userId],
    });
  }

  public async selectTaskContractor(
    taskId: number,
    dto: SelectTaskContractorDto
  ): Promise<void> {
    const taskModel = await this.findById(taskId);
    if (taskModel.contractorId) {
      throw new ConflictException('Contractor already selected');
    }

    const { contractorId } = dto;

    if (!taskModel.responses.includes(contractorId)) {
      throw new BadRequestException(
        'The contractor is not on the response list'
      );
    }

    const taskInProgress =
      await this.tasksRepository.findOneByContractorAndStatus(
        taskId,
        contractorId,
        TaskStatusId.InProgress
      );
    if (taskInProgress) {
      throw new BadRequestException(
        'The contractor already has a task in progress'
      );
    }

    await this.tasksRepository.update(taskId, {
      ...this.getUpdatedTaskData(taskModel),
      contractorId,
    });
  }

  public async changeTaskStatus(
    taskId: number,
    dto: ChangeTaskStatusDto,
    accessTokenPayload: AccessTokenPayload
  ): Promise<TaskModel> {
    const taskModel = await this.findById(taskId);
    const { statusId } = dto;
    const { sub: userId, roleId } = accessTokenPayload;

    this.validateStatus({
      currentStatusId: taskModel.statusId,
      newStatusId: statusId,
      contractorId: taskModel.contractorId,
      roleId,
    });

    this.isSameContractor({
      taskContractorId: taskModel.contractorId,
      userId,
      statusId,
    });

    return this.tasksRepository.update(taskId, {
      ...this.getUpdatedTaskData(taskModel),
      statusId: statusId,
    });
  }

  private validateStatus({
    currentStatusId,
    newStatusId,
    contractorId,
    roleId,
  }: {
    currentStatusId: TaskStatusId;
    newStatusId: TaskStatusId;
    contractorId: Uuid;
    roleId: UserRoleId;
  }): void {
    const availableStatusById: { [status in TaskStatusId]?: TaskStatusId[] } = {
      [TaskStatusId.New]: [TaskStatusId.InProgress, TaskStatusId.Cancelled],
      [TaskStatusId.InProgress]: [TaskStatusId.Done, TaskStatusId.Failed],
    };

    const availableStatusByRoleId: Record<UserRoleId, TaskStatusId[]> = {
      [UserRoleId.Customer]: [
        TaskStatusId.New,
        TaskStatusId.InProgress,
        TaskStatusId.Done,
        TaskStatusId.Cancelled,
      ],
      [UserRoleId.Contractor]: [TaskStatusId.Failed],
    };

    const isValidNewStatus = availableStatusById[currentStatusId]
      ? availableStatusById[currentStatusId].includes(newStatusId)
      : false;

    const isValidStatusByRole =
      availableStatusByRoleId[roleId].includes(newStatusId);

    if (!isValidNewStatus || !isValidStatusByRole) {
      throw new BadRequestException('Invalid new status');
    }

    if (newStatusId === TaskStatusId.InProgress && !contractorId) {
      throw new BadRequestException('Contractor id is required');
    }
  }

  private isSameContractor({
    taskContractorId,
    userId,
    statusId,
  }: {
    taskContractorId: Uuid;
    userId: Uuid;
    statusId: TaskStatusId;
  }) {
    if (statusId === TaskStatusId.Failed && taskContractorId !== userId) {
      throw new ForbiddenException(
        'The contractor can change task status to "Failed"'
      );
    }
  }

  private getUpdatedTaskData(taskModel: TaskModel): TaskModelProperties {
    return {
      title: taskModel.title,
      description: taskModel.description,
      categoryId: taskModel.categoryId,
      cityId: taskModel.cityId,
      price: taskModel.price,
      imageUrl: taskModel.imageUrl,
      address: taskModel.address,
      customerId: taskModel.customerId,
      executionDate: this.getExecutionDate(taskModel.executionDate),
      statusId: taskModel.statusId,
      contractorId: taskModel.contractorId,
      responses: taskModel.responses,
    };
  }

  private getExecutionDate(date: Date | string | null): string | null {
    return date
      ? this.dateTimeService.formatDate(date, DateTimeService.DATE_FORMAT)
      : null;
  }
}
