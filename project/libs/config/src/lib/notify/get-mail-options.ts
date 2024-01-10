import { ConfigService } from '@nestjs/config';
import { MailerAsyncOptions } from '@nestjs-modules/mailer/dist/interfaces/mailer-async-options.interface';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import * as path from 'node:path';

export const getMailOptions = (): MailerAsyncOptions => ({
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => ({
    transport: {
      host: configService.get<string>('mail.host'),
      port: configService.get<number>('mail.port'),
      auth: {
        user: configService.get<string>('mail.user'),
        pass: configService.get<string>('mail.password'),
      },
      secure: false,
    },
    defaults: {
      from: configService.get<string>('mail.from'),
    },
    template: {
      dir: path.join(__dirname, 'assets'),
      adapter: new HandlebarsAdapter(),
      options: {
        strict: true,
      },
    },
  }),
});
