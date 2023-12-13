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
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { fillObject } from '@project/libs/utils-core';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskRdo } from './rdo/task.rdo';

@ApiTags('Task service')
@Controller({
  path: 'tasks',
  version: '1',
})
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get('/')
  @ApiOperation({ summary: 'Getting task list' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Tasks list',
    type: TaskRdo,
    isArray: true,
  })
  public async getTaskList(): Promise<TaskRdo[]> {
    const tasks = await this.tasksService.getTaskList();
    return tasks.map((task) => fillObject(TaskRdo, task));
  }

  @Post('/')
  @ApiOperation({ summary: 'Creating new task' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'New task has been successfully created',
    type: TaskRdo,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  public async createTask(@Body() dto: CreateTaskDto): Promise<TaskRdo> {
    const task = await this.tasksService.createTask(dto);
    return fillObject(TaskRdo, task);
  }

  @Get('/:taskId')
  @ApiOperation({ summary: 'Getting detailed information about task' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Task details',
    type: TaskRdo,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not found',
  })
  public async getTask(@Param('taskId') taskId: string): Promise<TaskRdo> {
    const task = await this.tasksService.findById(taskId);
    return fillObject(TaskRdo, task);
  }

  @Patch('/:taskId')
  @ApiOperation({ summary: 'Update existing task' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Task details',
    type: TaskRdo,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not found',
  })
  public async updateTask(
    @Param('taskId') taskId: string,
    @Body() dto: UpdateTaskDto
  ): Promise<TaskRdo> {
    const task = await this.tasksService.updateTask(taskId, dto);
    return fillObject(TaskRdo, task);
  }

  @Delete('/:taskId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete existing task' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Task has been successfully deleted',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  public async deleteTask(@Param('taskId') taskId: string): Promise<void> {
    await this.tasksService.deleteTask(taskId);
  }
}
