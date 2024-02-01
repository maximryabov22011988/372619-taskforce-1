import { Module } from '@nestjs/common';
import { DateTimeService } from '@project/libs/services';
import { UsersModule } from '../users/users.module';
import { RolesModule } from '../roles/roles.module';
import { RefreshTokenModule } from '../refresh-token/refresh-token.module';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';

@Module({
  imports: [UsersModule, RolesModule, RefreshTokenModule],
  controllers: [AuthenticationController],
  providers: [
    AuthenticationService,
    LocalStrategy,
    JwtRefreshStrategy,
    DateTimeService,
  ],
})
export class AuthenticationModule {}
