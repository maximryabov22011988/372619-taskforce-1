import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ImageConfig } from '@project/config';
import { ImageModule } from './image/image.module';

const {
  ImageConfigModule: ConfigModule,
  getServeStaticOptions,
  getMongooseOptions,
} = ImageConfig;

@Module({
  imports: [
    ConfigModule,
    ImageModule,
    ServeStaticModule.forRootAsync(getServeStaticOptions()),
    MongooseModule.forRootAsync(getMongooseOptions()),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
