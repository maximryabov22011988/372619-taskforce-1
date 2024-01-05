import dayjs from 'dayjs';
import { Module } from '@nestjs/common';
import { DateTimeService, DAYJS_REGISTER_NAME } from '@project/services';
import { CommentsService } from '../comments/comments.service';
import { CommentsRepository } from '../comments/comments.repository';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TasksRepository } from './repository/tasks.repository';
import { CategoriesRepository } from './repository/category.repository';
import { TagsRepository } from './repository/tag.repository';

@Module({
  controllers: [TasksController],
  providers: [
    TasksService,
    TasksRepository,
    CategoriesRepository,
    TagsRepository,
    CommentsService,
    CommentsRepository,
    DateTimeService,
    {
      provide: DAYJS_REGISTER_NAME,
      useValue: dayjs,
    },
  ],
})
export class TasksModule {}
