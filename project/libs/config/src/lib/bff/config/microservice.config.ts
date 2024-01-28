import { registerAs } from '@nestjs/config';
import { validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { MicroserviceEnv } from '../microservice.env';

export interface MicroserviceConfig {
  userServiceUrl: string;
  imageServiceUrl: string;
  taskServiceUrl: string;
  staticUrl: string;
}

export default registerAs('microservice', (): MicroserviceConfig => {
  const config: MicroserviceConfig = {
    userServiceUrl: process.env.USER_SERVICE_URL,
    imageServiceUrl: process.env.IMAGE_SERVICE_URL,
    taskServiceUrl: process.env.TASK_SERVICE_URL,
    staticUrl: process.env.STATIC_URL,
  };

  const microserviceEnv = plainToInstance(MicroserviceEnv, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(microserviceEnv, {
    skipMissingProperties: false,
  });

  if (errors.length) {
    throw new Error(`[Microservice config]: Environments validation failed. Please check .bff.env file.
      Error message: ${errors.toString()}`);
  }

  return config;
});
