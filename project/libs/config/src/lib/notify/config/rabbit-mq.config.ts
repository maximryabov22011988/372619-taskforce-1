import { registerAs } from '@nestjs/config';
import { validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { Radix } from '@project/libs/shared-types';
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

export default registerAs('rabbitMq', (): RabbitMqConfig => {
  const config: RabbitMqConfig = {
    host: process.env.NOTIFY_RABBITMQ_HOST,
    port: parseInt(
      process.env.NOTIFY_RABBITMQ_PORT ?? DEFAULT_RABBIT_MQ_PORT.toString(),
      Radix.Decimal
    ),
    user: process.env.NOTIFY_RABBITMQ_USER,
    password: process.env.NOTIFY_RABBITMQ_PASSWORD,
    queue: process.env.NOTIFY_RABBITMQ_QUEUE,
    exchange: process.env.NOTIFY_RABBITMQ_EXCHANGE,
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
