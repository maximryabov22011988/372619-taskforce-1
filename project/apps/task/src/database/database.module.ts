import { Module, Global } from '@nestjs/common';
import { ObjectionModule } from '@willsoto/nestjs-objection';
import { knexSnakeCaseMappers } from 'objection';
import { knex } from './knex';
import { BaseModel } from './models/base.model';
import { CityModel } from './models/city.model';
import { CategoryModel } from './models/category.model';
import { StatusModel } from './models/status.model';
import { TagModel } from './models/tag.model';
import { CommentModel } from './models/comment.model';
import { TaskModel } from './models/task.model';

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
      TaskModel,
    ]),
  ],
  exports: [ObjectionModule],
})
export class DatabaseModule {}
