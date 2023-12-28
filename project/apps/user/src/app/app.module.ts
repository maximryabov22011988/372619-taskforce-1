import { Module } from '@nestjs/common';
import { UserConfig } from '@project/config';
import { DatabaseModule } from '../database/database.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { UsersModule } from './users/users.module';
import { ReviewsModule } from './reviews/reviews.module';

const { UserConfigModule: ConfigModule } = UserConfig;

@Module({
  imports: [
    ConfigModule,
    UsersModule,
    AuthenticationModule,
    ReviewsModule,
    DatabaseModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
