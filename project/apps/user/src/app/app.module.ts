import { Module } from '@nestjs/common';
import { AuthenticationModule } from './authentication/authentication.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { ReviewsModule } from './reviews/reviews.module';

@Module({
  imports: [AuthenticationModule, UsersModule, RolesModule, ReviewsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
