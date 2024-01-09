import { registerAs } from '@nestjs/config';
import { validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { JwtEnv } from './jwt.env';

export interface JWTConfig {
  accessTokenSecret: string;
  accessTokenExpiresIn: string;
}

export default registerAs('jwt', (): JWTConfig => {
  const config: JWTConfig = {
    accessTokenSecret: process.env.JWT_AT_SECRET,
    accessTokenExpiresIn: process.env.JWT_AT_EXPIRES_IN,
  };

  const jwtEnv = plainToInstance(JwtEnv, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(jwtEnv, {
    skipMissingProperties: false,
  });

  if (errors.length) {
    throw new Error(`[JWT config]: Environments validation failed. Please check .user.env file.
      Error message: ${errors.toString()}`);
  }

  return config;
});
