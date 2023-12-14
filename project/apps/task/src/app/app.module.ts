import { Module } from '@nestjs/common';
import { TaskConfig } from '@project/config';
import { TasksModule } from './tasks/tasks.module';
import { CommentsModule } from './comments/comments.module';
import { DatabaseModule } from '../database/database.module';

const { TaskConfigModule: ConfigModule } = TaskConfig;

@Module({
  imports: [ConfigModule, TasksModule, CommentsModule, DatabaseModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
