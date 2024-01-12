import { Module, Global } from '@nestjs/common';
import { ObjectionModule } from '@willsoto/nestjs-objection';
import { knexSnakeCaseMappers } from 'objection';
import { knex } from './knex';
import { BaseModel } from './models/base.model';
import { RoleModel } from './models/role.model';
import { SpecializationModel } from './models/specialization.model';
import { ReviewModel } from './models/review.model';
import { UserModel } from './models/user.model';

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
      RoleModel,
      SpecializationModel,
      ReviewModel,
      UserModel,
    ]),
  ],
  exports: [ObjectionModule],
})
export class DatabaseModule {}
