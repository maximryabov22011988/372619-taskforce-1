import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ImageFile } from '@project/libs/shared-types';

@Schema({
  collection: 'images',
  timestamps: true,
})
export class ImageModel extends Document implements ImageFile {
  @Prop({
    required: true,
  })
  public originalName: string;

  @Prop({
    required: true,
  })
  public name: string;

  @Prop({
    required: true,
  })
  public mimetype: string;

  @Prop({
    required: true,
  })
  public path: string;

  @Prop({
    required: true,
  })
  public size: number;
}

export const ImageSchema = SchemaFactory.createForClass(ImageModel);
