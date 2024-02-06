import { registerAs } from '@nestjs/config';
import { validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { Radix } from '@project/libs/shared-types';
import { HttpEnv } from '../http.env';

const DEFAULT_MAX_REDIRECTS = 5;
const DEFAULT_TIMEOUT = 5000;

export interface HttpConfig {
  maxRedirects: number;
  timeout: number;
}

export default registerAs('http', (): HttpConfig => {
  const config: HttpConfig = {
    maxRedirects: parseInt(
      process.env.HTTP_CLIENT_MAX_REDIRECTS || DEFAULT_MAX_REDIRECTS.toString(),
      Radix.Decimal
    ),
    timeout: parseInt(
      process.env.HTTP_CLIENT_TIMEOUT || DEFAULT_TIMEOUT.toString(),
      Radix.Decimal
    ),
  };

  const httpEnv = plainToInstance(HttpEnv, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(httpEnv, {
    skipMissingProperties: false,
  });

  if (errors.length) {
    throw new Error(`[HTTP config]: Environments validation failed. Please check .bff.env file.
      Error message: ${errors.toString()}`);
  }

  return config;
});
