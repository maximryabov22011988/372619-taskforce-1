import { Module } from '@nestjs/common';
import { UserConfig } from '@project/libs/config';
import { JwtModule } from '@project/libs/modules';
import { DatabaseModule } from '../database/database.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { UsersModule } from './users/users.module';
import { ReviewsModule } from './reviews/reviews.module';
import { NotifyModule } from './notify/notify.module';

const { UserConfigModule: ConfigModule } = UserConfig;

@Module({
  imports: [
    ConfigModule,
    JwtModule,
    NotifyModule,
    UsersModule,
    AuthenticationModule,
    ReviewsModule,
    DatabaseModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
