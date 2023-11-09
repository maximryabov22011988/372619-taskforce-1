import { ImageFile } from '@project/libs/shared-types';

export class ImageFileEntity implements ImageFile {
  public id: string;
  public hashName: string;
  public mimetype: string;
  public originalName: string;
  public path: string;
  public size: number;

  constructor(imageFile: ImageFile) {
    this.fillEntity(imageFile);
  }

  private fillEntity(imageFile: ImageFile) {
    Object.assign(this, imageFile);
  }
}
