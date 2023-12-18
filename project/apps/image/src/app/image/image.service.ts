import { Injectable, Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { ImageFile } from '@project/libs/shared-types';
import { ImageConfig } from '@project/config';
import { ImageFileEntity } from './image.entity';
import { ImageRepository } from './image.repository';

const { appConfig } = ImageConfig;

@Injectable()
export class ImageService {
  constructor(
    private readonly imageRepository: ImageRepository,

    @Inject(appConfig.KEY)
    private readonly applicationConfig: ConfigType<typeof appConfig>
  ) {}

  public async saveImageFile(
    imageFile: Express.Multer.File
  ): Promise<ImageFile> {
    const imageFileEntity = new ImageFileEntity({
      name: imageFile.filename,
      originalName: imageFile.originalname,
      path: `${this.applicationConfig.staticServePath}/${imageFile.filename}`,
    });

    return this.imageRepository.create(imageFileEntity);
  }
}
