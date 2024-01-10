import { Module } from '@nestjs/common';
import { DateTimeService } from '@project/libs/services';
import { NotifyModule } from '../notify/notify.module';
import { UsersModule } from '../users/users.module';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';

@Module({
  imports: [UsersModule, NotifyModule],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, DateTimeService],
})
export class AuthenticationModule {}
