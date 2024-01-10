import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotifyConfig } from '@project/libs/config';
import { EmailSubscriberModule } from './email-subscriber/email-subscriber.module';

const { NotifyConfigModule: ConfigModule, getMongooseOptions } = NotifyConfig;

@Module({
  imports: [
    ConfigModule,
    EmailSubscriberModule,
    MongooseModule.forRootAsync(getMongooseOptions()),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
