import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { v4 as makeUuid } from 'uuid';
import { DateTimeService } from '@project/services';
import { TaskStatusId } from '@project/libs/shared-types';
import { TaskModel } from '../../database/models/task.model';
import { CategoryModel } from '../../database/models/category.model';
import { CategoriesRepository } from './repository/category.repository';
import { TagsRepository } from './repository/tag.repository';
import { TasksRepository } from './repository/tasks.repository';
import { TaskQuery } from './tasks.query';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    private readonly tasksRepository: TasksRepository,
    private readonly categoriesRepository: CategoriesRepository,
    private readonly tagsRepository: TagsRepository,
    private readonly dateTimeService: DateTimeService
  ) {}

  public async findById(taskId: number): Promise<TaskModel> {
    const taskModel = await this.tasksRepository.findById(taskId);
    if (!taskModel) {
      throw new NotFoundException('Task was not found');
    }

    return taskModel;
  }

  public async findAll(query: TaskQuery): Promise<TaskModel[]> {
    return this.tasksRepository.findAll(query);
  }

  public async createTask(dto: CreateTaskDto): Promise<TaskModel> {
    let categoryModel = await this.getCategory(dto.category);
    if (!categoryModel) {
      categoryModel = await this.createCategory(dto.category);
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
      customerId: makeUuid(),
      contractorId: null,
    });

    await this.createTags(dto.tags ?? [], createdTaskModel.id);

    return createdTaskModel;
  }

  public async updateTask(
    taskId: number,
    dto: UpdateTaskDto
  ): Promise<TaskModel> {
    const taskModel = await this.findById(taskId);

    return this.tasksRepository.update(taskId, {
      title: taskModel.title,
      description: taskModel.description,
      categoryId: taskModel.categoryId,
      cityId: taskModel.cityId,
      price: taskModel.price,
      imageUrl: taskModel.imageUrl,
      address: taskModel.address,
      customerId: taskModel.customerId,
      executionDate: this.getExecutionDate(taskModel.executionDate),
      statusId: dto.statusId ?? taskModel.statusId,
      contractorId: dto.contractorId ?? taskModel.contractorId,
    });
  }

  public async deleteTask(taskId: number): Promise<void> {
    await this.findById(taskId);
    await this.tasksRepository.delete(taskId);
  }

  private checkIsValidTag(tag: string) {
    if (tag.includes(' ')) {
      throw new BadRequestException(`Invalid tag "${tag}"`);
    }
  }

  private async createTags(tags: string[], taskId: number): Promise<void> {
    if (tags.length) {
      const uniqTags = new Set([...tags]);

      for (const tag of uniqTags) {
        this.checkIsValidTag(tag);
        await this.tagsRepository.create({ name: tag }, taskId);
      }
    }
  }

  private async getCategory(name: string): Promise<CategoryModel> {
    return this.categoriesRepository.findByName(name);
  }

  private async createCategory(name: string): Promise<CategoryModel> {
    return this.categoriesRepository.create({ name });
  }

  private getExecutionDate(date: Date | string | null): string | null {
    return date
      ? this.dateTimeService.formatDate(date, DateTimeService.DATE_FORMAT)
      : null;
  }
}
