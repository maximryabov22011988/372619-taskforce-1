import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
  HttpStatus,
  Param,
  Inject,
  UsePipes,
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
import { ImageFile } from '@project/libs/shared-types';
import { ImageService } from './image.service';
import { MongoIdValidationPipe } from './pipe/mongo-id-validation.pipe';
import { FileSizeValidationPipe } from './pipe/file-size-validation.pipe';
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

  @Post('/upload/avatar')
  @ApiOperation({ summary: 'Uploading user avatar' })
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
  @UsePipes(new FileSizeValidationPipe({ maxSizeInKb: 500 }))
  public async uploadAvatar(
    @UploadedFile() file: Express.Multer.File
  ): Promise<ImageFile> {
    const newImageFile = await this.imageService.saveFile(file);
    return this.getImageFile(newImageFile);
  }

  @Post('/upload')
  @ApiOperation({ summary: 'Uploading image' })
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
  @UsePipes(new FileSizeValidationPipe({ maxSizeInKb: 1000 }))
  public async uploadImage(
    @UploadedFile() file: Express.Multer.File
  ): Promise<ImageFile> {
    const newImageFile = await this.imageService.saveFile(file);
    return this.getImageFile(newImageFile);
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
  public async getImageFileById(
    @Param('fileId', MongoIdValidationPipe) fileId: string
  ): Promise<ImageFile> {
    const imageFile = await this.imageService.getFile(fileId);
    return this.getImageFile(imageFile);
  }

  private getImageFile(imageFile: ImageFile): ImageFile {
    return fillObject(
      UploadedImageFileRdo,
      assign(imageFile, {
        path: `${this.applicationConfig.uploadServePath}${imageFile.path}`,
      })
    );
  }
}
