import { ImageFile, Entity } from '@project/libs/shared-types';

// FIXME Выпилить Entity
export class ImageFileEntity implements Entity<ImageFileEntity>, ImageFile {
  public id?: string;
  public originalName: string;
  public name: string;
  public mimetype: string;
  public path: string;
  public size: number;

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
