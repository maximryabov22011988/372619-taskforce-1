import { Module } from '@nestjs/common';
import { DateTimeService } from '@project/libs/services';

import { UsersRepository } from './users.repository';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersRepository, UsersService, DateTimeService],
  exports: [UsersRepository, UsersService],
})
export class UsersModule {}
