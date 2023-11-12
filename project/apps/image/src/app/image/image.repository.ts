import { Injectable } from '@nestjs/common';
import { ImageFile } from '@project/libs/shared-types';
import { ImageFileEntity } from './image.entity';

@Injectable()
export class ImageRepository {
  constructor() {}

  public async create(imageFile: ImageFileEntity): Promise<ImageFile> {
    return imageFile;
  }

  public async findById(fileId: string): Promise<ImageFile | null> {
    return null;
  }
}
