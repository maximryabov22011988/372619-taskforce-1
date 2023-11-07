import { Module, forwardRef } from '@nestjs/common';
import dayjs from 'dayjs';
import { DateTimeService, DAYJS_REGISTER_NAME } from '@project/services';
import { UsersModule } from '../users/users.module';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';

@Module({
  imports: [forwardRef(() => UsersModule)],
  controllers: [AuthenticationController],
  providers: [
    AuthenticationService,
    DateTimeService,
    {
      provide: DAYJS_REGISTER_NAME,
      useValue: dayjs,
    },
  ],
  exports: [AuthenticationService],
})
export class AuthenticationModule {}
