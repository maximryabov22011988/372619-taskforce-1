import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import dayjs from 'dayjs';
import { DateTimeService, DAYJS_REGISTER_NAME } from '@project/services';
import { ImageConfig } from '@project/config';
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
  providers: [
    ImageRepository,
    ImageService,
    DateTimeService,
    {
      provide: DAYJS_REGISTER_NAME,
      useValue: dayjs,
    },
  ],
})
export class ImageModule {}
