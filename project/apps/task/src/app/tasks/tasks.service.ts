import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as makeUuid } from 'uuid';
import { DateTimeService } from '@project/services';
import { Task, TaskStatus } from '@project/libs/shared-types';
import { TasksRepository } from './tasks.repository';
import { TaskEntity } from './tasks.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    private readonly tasksRepository: TasksRepository,
    private readonly dateTime: DateTimeService
  ) {}

  public async findById(taskId: number): Promise<Task> {
    const task = await this.tasksRepository.findById(taskId);
    if (!task) {
      throw new NotFoundException('Task was not found');
    }

    return task;
  }

  public async findAll(): Promise<Task[]> {
    return this.tasksRepository.findAll();
  }

  public async createTask(dto: CreateTaskDto): Promise<Task> {
    const task = {
      title: dto.title,
      description: dto.description,
      category: dto.category,
      city: dto.city,
      price: dto.price ?? 0,
      executionDate: dto.executionDate ?? null,
      imageUrl: dto.imageUrl ?? '',
      address: dto.address ?? null,
      tags: dto.tags ?? null,
      status: TaskStatus.New,
      categoryId: 1,
      cityId: 1,
      statusId: 1,
      customerId: makeUuid(),
      contractorId: makeUuid(),
      createdAt: this.dateTime.getDateTimeLocale(DateTimeService.UTC_FORMAT),
      updatedAt: this.dateTime.getDateTimeLocale(DateTimeService.UTC_FORMAT),
    };
    const taskEntity = new TaskEntity(task);

    return this.tasksRepository.create(taskEntity);
  }

  public async updateTask(taskId: number, dto: UpdateTaskDto): Promise<Task> {
    const task = await this.findById(taskId);
    const taskEntity = new TaskEntity({
      ...task,
      ...dto,
    });

    return this.tasksRepository.update(taskId, taskEntity);
  }

  public async deleteTask(taskId: number): Promise<void> {
    await this.findById(taskId);
    await this.tasksRepository.delete(taskId);
  }
}
