import {
  Controller,
  Get,
  Post,
  Param,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { fillObject } from '@project/libs/utils-core';
import { ImageService } from './image.service';
import { UploadedImageFileRdo } from './rdo/uploaded-image-file.rdo';

@Controller({
  path: 'image',
  version: '1',
})
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Get('/:fileId')
  public async getImage(
    @Param('fileId') fileId: string
  ): Promise<UploadedImageFileRdo> {
    const imageFile = await this.imageService.getImageFile(fileId);
    return fillObject(UploadedImageFileRdo, imageFile);
  }

  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  public async uploadImage(
    @UploadedFile() imageFile: Express.Multer.File
  ): Promise<UploadedImageFileRdo> {
    const image = this.imageService.saveImageFile(imageFile);
    return fillObject(UploadedImageFileRdo, image);
  }
}
