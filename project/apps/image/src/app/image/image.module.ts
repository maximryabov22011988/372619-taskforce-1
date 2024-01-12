import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { DateTimeService } from '@project/libs/services';
import { ImageConfig } from '@project/libs/config';
import { ImageModel, ImageSchema } from './image.model';
import { ImageController } from './image.controller';
import { ImageService } from './image.service';
import { ImageRepository } from './image.repository';

const { ImageConfigModule: ConfigModule, getServeStaticOptions } = ImageConfig;

@Module({
  imports: [
    ConfigModule,
    ServeStaticModule.forRootAsync(getServeStaticOptions()),
    MongooseModule.forFeature([{ name: ImageModel.name, schema: ImageSchema }]),
  ],
  controllers: [ImageController],
  providers: [ImageRepository, ImageService, DateTimeService],
})
export class ImageModule {}
