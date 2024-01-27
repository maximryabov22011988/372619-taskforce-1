import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { default as appConfig } from './config/app.config';
import { default as httpConfig } from './config/http.config';
import { default as microserviceConfig } from './config/microservice.config';
import { getHttpOptions } from './get-http-options';

const ENV_API_GATEWAY_FILE_PATH = 'apps/bff/.bff.env';

export { appConfig, httpConfig, microserviceConfig, getHttpOptions };

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [appConfig, httpConfig, microserviceConfig],
      envFilePath: ENV_API_GATEWAY_FILE_PATH,
    }),
  ],
})
export class ApiGatewayConfigModule {}
