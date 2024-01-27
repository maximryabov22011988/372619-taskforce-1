import { Module, Global } from '@nestjs/common';
import { ObjectionModule } from '@willsoto/nestjs-objection';
import { knexSnakeCaseMappers } from 'objection';
import { knex } from './knex';
import { BaseModel } from './models/base.model';
import { RoleModel } from './models/role.model';
import { SpecializationModel } from './models/specialization.model';
import { UserModel } from './models/user.model';
import { UsersSpecializationsModel } from './models/users-spectializations.model';
import { RefreshTokenModel } from './models/refresh-token.model';

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
      UserModel,
      UsersSpecializationsModel,
      RefreshTokenModel,
    ]),
  ],
  exports: [ObjectionModule],
})
export class DatabaseModule {}
