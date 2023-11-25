import { ImageFile } from '@project/libs/shared-types';

export class ImageFileEntity implements ImageFile {
  public name: string;
  public originalName: string;

  constructor(imageFile: ImageFile) {
    this.fillEntity(imageFile);
  }

  private fillEntity(imageFile: ImageFile) {
    Object.assign(this, imageFile);
  }
}
