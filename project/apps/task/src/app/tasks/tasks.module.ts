import { Module } from '@nestjs/common';
import { DateTimeService } from '@project/libs/services';
import { CommentsService } from '../comments/comments.service';
import { CommentsRepository } from '../comments/comments.repository';
import { NotifyModule } from '../notify/notify.module';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TasksRepository } from './repository/tasks.repository';
import { CategoriesRepository } from './repository/categories.repository';
import { TagsRepository } from './repository/tags.repository';

@Module({
  imports: [NotifyModule],
  controllers: [TasksController],
  providers: [
    TasksService,
    TasksRepository,
    CategoriesRepository,
    TagsRepository,
    CommentsService,
    CommentsRepository,
    DateTimeService,
  ],
})
export class TasksModule {}
