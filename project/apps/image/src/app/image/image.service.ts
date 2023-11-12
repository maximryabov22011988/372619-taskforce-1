import { Injectable, NotFoundException } from '@nestjs/common';
import { Express } from 'express';
import { ImageFile } from '@project/libs/shared-types';
import { ImageFileEntity } from './image.entity';
import { ImageRepository } from './image.repository';

@Injectable()
export class ImageService {
  constructor(private readonly imageRepository: ImageRepository) {}

  public async getImageFile(fileId: string): Promise<ImageFile> {
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
      id: '5843re8543fie8543j',
      originalName: 'filename.jpg',
      path: '/2023/11/8787eacc-a172-44cd-906a-ad1e52527114.png',
      hashName: '87a5eacc-a172-44cd-906a-ad1e52527114',
      mimetype: 'image/png',
      size: 393115,
    });

    return this.imageRepository.create(imageFileEntity);
  }
}
