import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as makeUuid } from 'uuid';
import pick from 'lodash/pick';
import { DateTimeService } from '@project/services';
import { Task, TaskStatus } from '@project/libs/shared-types';
import { ITaskModel } from '../../database/models/task.model';
import { TasksRepository } from './tasks.repository';
import { TaskEntity } from './tasks.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    private readonly tasksRepository: TasksRepository,
    private readonly dateTimeService: DateTimeService
  ) {}

  public async findById(taskId: number): Promise<Task> {
    const taskModel = await this.tasksRepository.findById(taskId);
    if (!taskModel) {
      throw new NotFoundException('Task was not found');
    }

    return this.getTask(taskModel);
  }

  public async findAll(): Promise<Task[]> {
    const taskModels = await this.tasksRepository.findAll();
    return taskModels.map((taskModel) => this.getTask(taskModel));
  }

  public async createTask(dto: CreateTaskDto): Promise<Task> {
    const taskEntity = new TaskEntity({
      ...dto,
      price: dto.price ?? 0,
      executionDate: this.getExecutionDate(dto.executionDate),
      imageUrl: dto.imageUrl ?? '',
      address: dto.address ?? null,
      tags: dto.tags ?? null,
      status: TaskStatus.New,
      customerId: makeUuid(),
      contractorId: null,
    });
    const taskModel = await this.tasksRepository.create(taskEntity);

    return this.getTask(taskModel);
  }

  public async updateTask(taskId: number, dto: UpdateTaskDto): Promise<Task> {
    const task = await this.findById(taskId);

    const taskEntity = new TaskEntity({
      ...pick(task, [
        'title',
        'description',
        'category',
        'city',
        'price',
        'imageUrl',
        'address',
        'tags',
        'customerId',
      ]),
      executionDate: this.getExecutionDate(task.executionDate),
      status: dto.status ?? task.status,
      contractorId: dto.contractorId ?? task.contractorId,
    });
    const taskModel = await this.tasksRepository.update(taskId, taskEntity);

    return this.getTask(taskModel);
  }

  public async deleteTask(taskId: number): Promise<void> {
    await this.findById(taskId);
    await this.tasksRepository.delete(taskId);
  }

  private getTask(task: ITaskModel) {
    return {
      ...task,
      executionDate: this.getExecutionDate(task.executionDate),
    };
  }

  private getExecutionDate(date: Date | string | null): string | null {
    return date
      ? this.dateTimeService.formatDate(date, DateTimeService.DATE_FORMAT)
      : null;
  }
}
