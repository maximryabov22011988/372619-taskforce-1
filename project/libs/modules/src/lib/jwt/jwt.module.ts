import { Module, Global } from '@nestjs/common';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { getJwtOptions } from './get-jwt-options';
import { JwtAccessStrategy } from './jwt-access.strategy';

@Global()
@Module({
  imports: [
    NestJwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: getJwtOptions,
    }),
  ],
  providers: [JwtAccessStrategy],
  exports: [NestJwtModule, JwtAccessStrategy],
})
export class JwtModule {}
