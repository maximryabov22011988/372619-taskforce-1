import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ImageConfig } from '@project/config';
import { ImageModule } from './image/image.module';

const { getMongooseOptions } = ImageConfig;

@Module({
  imports: [ImageModule, MongooseModule.forRootAsync(getMongooseOptions())],
  controllers: [],
  providers: [],
})
export class AppModule {}
