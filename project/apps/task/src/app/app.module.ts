import { Module } from '@nestjs/common';
import { TaskConfig } from '@project/config';
import { DatabaseModule } from '../database/database.module';
import { TasksModule } from './tasks/tasks.module';
import { CommentsModule } from './comments/comments.module';

const { TaskConfigModule: ConfigModule } = TaskConfig;

@Module({
  imports: [ConfigModule, TasksModule, CommentsModule, DatabaseModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
