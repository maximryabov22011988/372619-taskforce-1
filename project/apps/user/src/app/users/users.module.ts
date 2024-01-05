import { Module } from '@nestjs/common';
import dayjs from 'dayjs';
import { DateTimeService, DAYJS_REGISTER_NAME } from '@project/services';
import { UsersRepository } from './users.repository';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [
    DateTimeService,
    {
      provide: DAYJS_REGISTER_NAME,
      useValue: dayjs,
    },
    UsersRepository,
    UsersService,
  ],
  exports: [UsersRepository, UsersService],
})
export class UsersModule {}
