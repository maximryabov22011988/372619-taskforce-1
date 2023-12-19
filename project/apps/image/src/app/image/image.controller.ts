import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
  HttpStatus,
  Param,
  Inject,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { Express } from 'express';
import assign from 'lodash/assign';
import { fillObject } from '@project/libs/utils-core';
import { ImageConfig } from '@project/config';
import { ImageService } from './image.service';
import { UploadedImageFileRdo } from './rdo/uploaded-image-file.rdo';

const { appConfig } = ImageConfig;

@Controller({
  path: 'image',
  version: '1',
})
export class ImageController {
  constructor(
    private readonly imageService: ImageService,

    @Inject(appConfig.KEY)
    private readonly applicationConfig: ConfigType<typeof appConfig>
  ) {}

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
  @UseInterceptors(FileInterceptor('file'))
  public async uploadImage(
    @UploadedFile() file: Express.Multer.File
  ): Promise<UploadedImageFileRdo> {
    const newImageFile = await this.imageService.saveFile(file);

    return fillObject(
      UploadedImageFileRdo,
      assign(newImageFile, {
        path: `${this.applicationConfig.uploadServePath}${newImageFile.path}`,
      })
    );
  }

  @Get(':fileId')
  @ApiOperation({ summary: 'Getting image file' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Image file is successfully received',
    type: UploadedImageFileRdo,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not found',
  })
  public async getImageFile(@Param('fileId') fileId: string) {
    const imageFile = await this.imageService.getFile(fileId);

    return fillObject(
      UploadedImageFileRdo,
      assign(imageFile, {
        path: `${this.applicationConfig.uploadServePath}${imageFile.path}`,
      })
    );
  }
}
