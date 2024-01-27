import { Module } from '@nestjs/common';
import { DateTimeService } from '@project/libs/services';
import { RefreshTokenRepository } from './refresh-token.repository';
import { RefreshTokenService } from './refresh-token.service';

@Module({
  providers: [RefreshTokenService, RefreshTokenRepository, DateTimeService],
  exports: [RefreshTokenService],
})
export class RefreshTokenModule {}
