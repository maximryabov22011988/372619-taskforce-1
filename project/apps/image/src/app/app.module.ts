import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import {
  ConfigImageModule,
  getMongooseOptions,
  getServeStaticOptions,
} from '@project/config';
import { ImageModule } from './image/image.module';

@Module({
  imports: [
    ImageModule,
    ConfigImageModule,
    ServeStaticModule.forRootAsync(getServeStaticOptions()),
    MongooseModule.forRootAsync(getMongooseOptions()),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
