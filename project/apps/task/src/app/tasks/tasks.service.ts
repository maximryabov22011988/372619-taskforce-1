import { Injectable, NotFoundException } from '@nestjs/common';
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

  public async findById(taskId: string): Promise<Task> {
    const task = await this.tasksRepository.findById(taskId);

    if (!task) {
      throw new NotFoundException('Task was not found');
    }

    return task;
  }

  public async getTaskList(): Promise<Task[]> {
    return this.tasksRepository.findAll();
  }

  public async createTask(dto: CreateTaskDto): Promise<Task> {
    const task = {
      ...dto,
      price: dto.price ?? 0,
      executionDate: dto.executionDate ?? null,
      image: dto.image ?? '',
      address: dto.address ?? '',
      tags: dto.tags ?? [],
      createdAt: this.dateTime.getDateTimeLocale(DateTimeService.UTC_FORMAT),
      status: TaskStatus.New,
      contractorId: '',
      customerId: '',
    };
    const taskEntity = new TaskEntity(task);

    return this.tasksRepository.create(taskEntity);
  }

  public async updateTask(taskId: string, dto: UpdateTaskDto): Promise<Task> {
    const task = await this.findById(taskId);
    return this.tasksRepository.update(taskId, { ...task, ...dto });
  }

  public async deleteTask(taskId: string): Promise<void> {
    await this.findById(taskId);
    await this.tasksRepository.delete(taskId);
  }
}
