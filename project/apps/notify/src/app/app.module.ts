import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotifyConfig } from '@project/libs/config';
import { getMongooseOptions } from '@project/libs/utils-core';
import { EmailSubscriberModule } from './email-subscriber/email-subscriber.module';
import { MailModule } from './mail/mail.module';

const { NotifyConfigModule: ConfigModule } = NotifyConfig;

@Module({
  imports: [
    ConfigModule,
    EmailSubscriberModule,
    MongooseModule.forRootAsync(getMongooseOptions()),
    MailModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
