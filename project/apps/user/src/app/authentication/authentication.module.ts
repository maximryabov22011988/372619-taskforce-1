import { Module } from '@nestjs/common';
import { DateTimeService } from '@project/libs/services';
import { UsersModule } from '../users/users.module';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';

@Module({
  imports: [UsersModule],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, DateTimeService],
})
export class AuthenticationModule {}
