import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { Express } from 'express';
import { diskStorage } from 'multer';
import { v4 as makeUuid } from 'uuid';
import { parse } from 'path';
import { fillObject } from '@project/libs/utils-core';
import { ImageService } from './image.service';
import { UploadedImageFileRdo } from './rdo/uploaded-image-file.rdo';

const storage = diskStorage({
  destination: `./${process.env.STATIC_PATH}`,
  filename(_, file, callback) {
    const parsedPath = parse(file.originalname);
    const filename = `${parsedPath.name.replace(/\s/g, '')}-${makeUuid()}`;
    const extension = parsedPath.ext;
    callback(null, `${filename}${extension}`);
  },
});

@Controller({
  path: 'image',
  version: '1',
})
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post('/upload')
  @ApiOperation({ summary: 'Uploading image file' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Image file is successfully uploaded',
    type: UploadedImageFileRdo,
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      storage,
    })
  )
  public async uploadImage(
    @UploadedFile() file: Express.Multer.File
  ): Promise<UploadedImageFileRdo> {
    const imageFile = await this.imageService.saveImageFile(file);
    return fillObject(UploadedImageFileRdo, imageFile);
  }
}
