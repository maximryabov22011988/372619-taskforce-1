import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ApiGatewayConfig } from '@project/libs/config';
import { StaticModule } from './modules/static/static.module';
import { CheckAuthGuard } from './guards/check-auth.guard';
import { AuthController } from './controllers/auth/auth.controller';
import { TaskController } from './controllers/task/task.controller';
import { UserController } from './controllers/user/user.controller';
import { ReferencesController } from './controllers/references/references.controller';

const { ApiGatewayConfigModule: ConfigModule, getHttpOptions } =
  ApiGatewayConfig;

@Module({
  imports: [
    ConfigModule,
    HttpModule.registerAsync(getHttpOptions()),
    StaticModule,
  ],
  controllers: [
    AuthController,
    TaskController,
    UserController,
    ReferencesController,
  ],
  providers: [CheckAuthGuard],
})
export class AppModule {}
