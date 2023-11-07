import { Module, forwardRef } from '@nestjs/common';
import { AuthenticationModule } from '../authentication/authentication.module';
import { UserRepository } from './users.repository';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [forwardRef(() => AuthenticationModule)],
  providers: [UserRepository, UsersService],
  exports: [UserRepository],
  controllers: [UsersController],
})
export class UsersModule {}
