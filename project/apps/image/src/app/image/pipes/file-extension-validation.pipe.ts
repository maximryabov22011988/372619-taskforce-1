import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { Express } from 'express';

@Injectable()
export class FileExtensionValidationPipe implements PipeTransform {
  constructor(private allowedExtensions: string[]) {}

  public transform(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException(
        'File uploading request does not contain a file'
      );
    }

    const fileExtension = file.originalname.split('.').pop();
    if (!this.allowedExtensions.includes(fileExtension.toLowerCase())) {
      throw new BadRequestException(
        `The file extension is not allowed. Allowed extensions: ${this.allowedExtensions.join(
          ', '
        )}`
      );
    }

    return file;
  }
}
