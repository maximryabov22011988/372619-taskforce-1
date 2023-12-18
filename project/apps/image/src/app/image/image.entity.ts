import { ImageFile, Entity } from '@project/libs/shared-types';

export class ImageFileEntity implements Entity<ImageFileEntity>, ImageFile {
  public id?: string;
  public name: string;
  public originalName: string;
  public path: string;

  constructor(imageFile: ImageFile) {
    this.fillEntity(imageFile);
  }

  public toObject() {
    return { ...this };
  }

  public fillEntity(imageFile: ImageFile) {
    Object.assign(this, imageFile);
  }
}
