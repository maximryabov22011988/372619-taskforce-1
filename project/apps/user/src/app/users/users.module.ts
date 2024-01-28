import { Module } from '@nestjs/common';
import { DateTimeService } from '@project/libs/services';

import { SpecializationsModule } from '../specializations/specializations.module';
import { RolesModule } from '../roles/roles.module';
import { SubscribeModule } from '../subscribe/subscribe.module';
import { UsersRepository } from './users.repository';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [RolesModule, SpecializationsModule],
  controllers: [UsersController],
  providers: [UsersRepository, UsersService, DateTimeService],
  exports: [UsersRepository, UsersService],
})
export class UsersModule {}
