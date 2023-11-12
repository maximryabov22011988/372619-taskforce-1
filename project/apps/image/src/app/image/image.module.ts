import { Module } from '@nestjs/common';
import { ImageController } from './image.controller';
import { ImageService } from './image.service';
import { ImageRepository } from './image.repository';

@Module({
  controllers: [ImageController],
  providers: [ImageService, ImageRepository],
})
export class ImageModule {}
