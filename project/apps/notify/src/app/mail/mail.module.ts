import { Module } from '@nestjs/common';
import { NotifyConfig } from '@project/libs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mail.service';

const { getMailOptions } = NotifyConfig;

@Module({
  imports: [MailerModule.forRootAsync(getMailOptions())],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
