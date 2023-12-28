import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as makeUuid } from 'uuid';
import { DateTimeService } from '@project/services';
import { TaskStatus } from '@project/libs/shared-types';
import { TaskModel } from '../../database/models/task.model';
import { TasksRepository } from './tasks.repository';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    private readonly tasksRepository: TasksRepository,
    private readonly dateTimeService: DateTimeService
  ) {}

  public async findById(taskId: number): Promise<TaskModel> {
    const taskModel = await this.tasksRepository.findById(taskId);
    if (!taskModel) {
      throw new NotFoundException('Task was not found');
    }

    return taskModel;
  }

  public async findAll(): Promise<TaskModel[]> {
    return this.tasksRepository.findAll();
  }

  public async createTask(dto: CreateTaskDto): Promise<TaskModel> {
    return this.tasksRepository.create({
      ...dto,
      price: dto.price ?? 0,
      executionDate: this.getExecutionDate(dto.executionDate),
      imageUrl: dto.imageUrl ?? '',
      address: dto.address ?? null,
      categoryId: 1,
      cityId: 1,
      statusId: TaskStatus.New,
      customerId: makeUuid(),
      contractorId: null,
    });
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

  private getExecutionDate(date: Date | string | null): string | null {
    return date
      ? this.dateTimeService.formatDate(date, DateTimeService.DATE_FORMAT)
      : null;
  }
}
