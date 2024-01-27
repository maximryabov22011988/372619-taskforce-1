import { Module } from '@nestjs/common';
import { TaskConfig } from '@project/libs/config';
import { JwtModule } from '@project/libs/modules';
import { DatabaseModule } from '../database/database.module';
import { TasksModule } from './tasks/tasks.module';
import { CategoriesModule } from './categories/categories.module';
import { ReviewsModule } from './reviews/reviews.module';
import { CommentsModule } from './comments/comments.module';
import { StatusesModule } from './statuses/statuses.module';

const { TaskConfigModule: ConfigModule } = TaskConfig;

@Module({
  imports: [
    ConfigModule,
    JwtModule,
    CategoriesModule,
    StatusesModule,
    TasksModule,
    CommentsModule,
    ReviewsModule,
    DatabaseModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
