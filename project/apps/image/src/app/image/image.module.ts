import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ImageModel, ImageSchema } from './image.model';
import { ImageController } from './image.controller';
import { ImageService } from './image.service';
import { ImageRepository } from './image.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ImageModel.name, schema: ImageSchema }]),
  ],
  controllers: [ImageController],
  providers: [ImageRepository, ImageService],
})
export class ImageModule {}
