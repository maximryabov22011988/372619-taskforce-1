import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { CommentsModule } from './comments/comments.module';

@Module({
  imports: [TasksModule, CommentsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
