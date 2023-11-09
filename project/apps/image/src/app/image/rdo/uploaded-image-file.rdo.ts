import { Expose } from 'class-transformer';

export class UploadedImageFileRdo {
  @Expose()
  public id: string;

  @Expose()
  public originalName: string;

  @Expose()
  public hashName: string;

  @Expose()
  public mimetype: string;

  @Expose()
  public size: number;

  @Expose()
  public path: string;
}
