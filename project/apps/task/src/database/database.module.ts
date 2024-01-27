import { Module, Global } from '@nestjs/common';
import { ObjectionModule } from '@willsoto/nestjs-objection';
import { knexSnakeCaseMappers } from 'objection';
import { BaseModel } from './models/base.model';
import { CityModel } from './models/city.model';
import { CategoryModel } from './models/category.model';
import { ReviewModel } from './models/review.model';
import { StatusModel } from './models/status.model';
import { TagModel } from './models/tag.model';
import { CommentModel } from './models/comment.model';
import { TaskModel } from './models/task.model';
import { TasksTagsModel } from './models/tasks-tags.model';
import { knex } from './knex';

@Global()
@Module({
  imports: [
    ObjectionModule.registerAsync({
      useFactory: async () => ({
        Model: BaseModel,
        config: {
          client: knex.client,
          connection: knex.connection,
          debug: Boolean(knex.debug),
          ...knexSnakeCaseMappers(),
        },
      }),
    }),
    ObjectionModule.forFeature([
      CityModel,
      CategoryModel,
      StatusModel,
      TagModel,
      CommentModel,
      ReviewModel,
      TaskModel,
      TasksTagsModel,
    ]),
  ],
  exports: [ObjectionModule],
})
export class DatabaseModule {}
