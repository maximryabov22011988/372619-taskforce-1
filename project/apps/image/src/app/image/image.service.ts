import { Injectable, NotFoundException } from '@nestjs/common';
import { Express } from 'express';
import { ImageFile } from '@project/libs/shared-types';
import { ImageFileEntity } from './image.entity';
import { ImageRepository } from './image.repository';
import { join } from 'path';
import * as process from 'process';

@Injectable()
export class ImageService {
  constructor(private readonly imageRepository: ImageRepository) {}

  public async getImageFileById(fileId: string): Promise<ImageFile> {
    const image = await this.imageRepository.findById(fileId);

    if (!image) {
      throw new NotFoundException(`Image file with id "${fileId}" not found`);
    }

    return image;
  }

  public async saveImageFile(
    imageFile: Express.Multer.File
  ): Promise<ImageFile> {
    const imageFileEntity = new ImageFileEntity({
      name: imageFile.filename,
      originalName: imageFile.originalname,
    });

    return this.imageRepository.create(imageFileEntity);
  }
}
