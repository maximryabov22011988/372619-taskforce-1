import { registerAs } from '@nestjs/config';
import { validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { RabbitMqEnv } from '../rabbit-mq.env';

const DEFAULT_RABBIT_MQ_PORT = 5672;

export interface RabbitMqConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  queue: string;
  exchange: string;
}

export default registerAs('rabbit', (): RabbitMqConfig => {
  const config: RabbitMqConfig = {
    host: process.env.RABBITMQ_HOST,
    port: parseInt(
      process.env.RABBITMQ_PORT ?? DEFAULT_RABBIT_MQ_PORT.toString(),
      10
    ),
    user: process.env.RABBITMQ_USER,
    password: process.env.RABBITMQ_PASSWORD,
    queue: process.env.RABBITMQ_QUEUE,
    exchange: process.env.RABBITMQ_EXCHANGE,
  };

  const rabbitMqEnv = plainToInstance(RabbitMqEnv, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(rabbitMqEnv, {
    skipMissingProperties: false,
  });

  if (errors.length) {
    throw new Error(`[RabbitMq config]: Environments validation failed. Please check .notify.env file.
      Error message: ${errors.toString()}`);
  }

  return config;
});
