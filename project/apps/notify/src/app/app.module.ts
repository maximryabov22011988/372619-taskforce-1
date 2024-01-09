import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotifyConfig } from '@project/libs/config';
import { NotifyModule } from './notify/notify.module';

const { getMongooseOptions } = NotifyConfig;

@Module({
  imports: [NotifyModule, MongooseModule.forRootAsync(getMongooseOptions())],
  controllers: [],
  providers: [],
})
export class AppModule {}
