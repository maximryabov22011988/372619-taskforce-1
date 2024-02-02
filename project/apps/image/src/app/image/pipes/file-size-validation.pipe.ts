import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';

const convertToKb = (sizeInByte: number) => sizeInByte / 1000;

type FileSizeValidationPipeOptions = {
  maxSizeInKb: number;
};

@Injectable()
export class FileSizeValidationPipe implements PipeTransform {
  private maxSizeInKb = null;

  constructor(private readonly options: FileSizeValidationPipeOptions) {
    Object.assign(this, options);
  }

  public transform(file: File) {
    const { size } = file;

    if (this.maxSizeInKb && convertToKb(size) > this.maxSizeInKb) {
      throw new BadRequestException(
        `Invalid file size. File should not be larger than ${this.maxSizeInKb} kb`
      );
    }

    return file;
  }
}
