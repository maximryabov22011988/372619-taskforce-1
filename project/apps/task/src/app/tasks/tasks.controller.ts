import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { fillObject } from '@project/libs/utils-core';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskRdo } from './rdo/task.rdo';

@Controller({
  path: 'tasks',
  version: '1',
})
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get('/:taskId')
  public async getTask(@Param('taskId') taskId: string): Promise<TaskRdo> {
    const task = await this.tasksService.findById(taskId);
    return fillObject(TaskRdo, task);
  }

  @Get('/')
  public async getTaskList(): Promise<TaskRdo[]> {
    const tasks = await this.tasksService.getTaskList();
    return tasks.map((task) => fillObject(TaskRdo, task));
  }

  @Post('/')
  public async createTask(@Body() dto: CreateTaskDto): Promise<TaskRdo> {
    const task = await this.tasksService.createTask(dto);
    return fillObject(TaskRdo, task);
  }

  @Patch('/:taskId')
  public async updateTask(
    @Param('taskId') taskId: string,
    @Body() dto: UpdateTaskDto
  ): Promise<TaskRdo> {
    const task = await this.tasksService.updateTask(taskId, dto);
    return fillObject(TaskRdo, task);
  }

  @Delete('/:taskId')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deleteTask(@Param('taskId') taskId: string): Promise<void> {
    await this.tasksService.deleteTask(taskId);
  }
}
