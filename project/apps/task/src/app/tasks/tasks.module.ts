import { Module } from '@nestjs/common';
import { DateTimeService } from '@project/libs/services';
import { CategoriesModule } from '../categories/categories.module';
import { TagsModule } from '../tags/tags.module';
import { CommentsModule } from '../comments/comments.module';
import { NotifyModule } from '../notify/notify.module';
import { CitiesModule } from '../cities/cities.module';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TasksRepository } from './tasks.repository';

@Module({
  imports: [
    NotifyModule,
    CategoriesModule,
    TagsModule,
    CommentsModule,
    CitiesModule,
  ],
  controllers: [TasksController],
  providers: [TasksService, TasksRepository, DateTimeService],
  exports: [TasksService],
})
export class TasksModule {}
