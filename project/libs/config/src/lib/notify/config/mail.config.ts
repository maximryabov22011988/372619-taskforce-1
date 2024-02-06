import { registerAs } from '@nestjs/config';
import { validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { Radix } from '@project/libs/shared-types';
import { MailEnv } from '../mail.env';

const DEFAULT_SMTP_PORT = 25;

export interface MailConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  from: string;
}

export default registerAs('mail', (): MailConfig => {
  const config: MailConfig = {
    host: process.env.MAIL_SMTP_HOST,
    port: parseInt(
      process.env.MAIL_SMTP_PORT ?? DEFAULT_SMTP_PORT.toString(),
      Radix.Decimal
    ),
    user: process.env.MAIL_SMTP_USER,
    password: process.env.MAIL_SMTP_PASSWORD,
    from: process.env.MAIL_SMTP_FROM,
  };

  const mailEnv = plainToInstance(MailEnv, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(mailEnv, {
    skipMissingProperties: false,
  });

  if (errors.length) {
    throw new Error(`[Mail config]: Environments validation failed. Please check .notify.env file.
      Error message: ${errors.toString()}`);
  }

  return config;
});
