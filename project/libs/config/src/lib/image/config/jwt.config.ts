import { registerAs } from '@nestjs/config';
import { validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { JwtEnv } from '../jwt.env';

export interface JWTConfig {
  accessTokenSecret: string;
  accessTokenExpiresIn: string;
  refreshTokenSecret: string;
  refreshTokenExpiresIn: string;
}

export default registerAs('jwt', (): JWTConfig => {
  const config: JWTConfig = {
    accessTokenSecret: process.env.IMAGE_JWT_AT_SECRET,
    accessTokenExpiresIn: process.env.IMAGE_JWT_AT_EXPIRES_IN,
    refreshTokenSecret: process.env.IMAGE_JWT_RT_SECRET,
    refreshTokenExpiresIn: process.env.IMAGE_JWT_RT_EXPIRES_IN,
  };

  const jwtEnv = plainToInstance(JwtEnv, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(jwtEnv, {
    skipMissingProperties: false,
  });

  if (errors.length) {
    throw new Error(`[JWT config]: Environments validation failed. Please check .image.env file.
      Error message: ${errors.toString()}`);
  }

  return config;
});
