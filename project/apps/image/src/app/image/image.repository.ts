import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, HydratedDocument } from 'mongoose';
import { ImageFile } from '@project/libs/shared-types';
import { ImageFileEntity } from './image.entity';
import { ImageModel } from './image.model';

@Injectable()
export class ImageRepository {
  constructor(
    @InjectModel(ImageModel.name)
    private readonly imageFileModel: Model<HydratedDocument<ImageModel>>
  ) {}

  public async create(item: ImageFileEntity): Promise<ImageFile> {
    const file = new this.imageFileModel(item);
    return file.save();
  }

  public async findById(id: string): Promise<ImageFile | null> {
    return this.imageFileModel.findOne({ _id: id }).exec();
  }
}
