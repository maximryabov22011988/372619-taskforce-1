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
  UseGuards,
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
import { ImageConfig } from '@project/libs/config';
import { JwtAuthGuard, Roles, RolesGuard } from '@project/libs/validators';
import { ImageFile, UserRoleId } from '@project/libs/shared-types';
import { UploadedImageFileRdo } from '@project/libs/rdo';
import { ImageService } from './image.service';
import { MongoIdValidationPipe } from './pipes/mongo-id-validation.pipe';
import { FileExtensionValidationPipe } from './pipes/file-extension-validation.pipe';
import { FileSizeValidationPipe } from './pipes/file-size-validation.pipe';

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

  @Post('upload/avatar')
  @UseInterceptors(FileInterceptor('file'))
  @UsePipes(
    new FileSizeValidationPipe({ maxSizeInKb: 500 }),
    new FileExtensionValidationPipe(['jpeg', 'png'])
  )
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
  public async uploadAvatar(
    @UploadedFile() file: Express.Multer.File
  ): Promise<ImageFile> {
    const newImageFile = await this.imageService.saveFile(file);
    return this.getImageFile(newImageFile);
  }

  @Roles(UserRoleId.Customer)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @UsePipes(
    new FileSizeValidationPipe({ maxSizeInKb: 1000 }),
    new FileExtensionValidationPipe(['jpg', 'png'])
  )
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
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Image file is successfully uploaded',
    type: UploadedImageFileRdo,
  })
  @ApiConsumes('multipart/form-data')
  public async uploadImage(
    @UploadedFile() file: Express.Multer.File
  ): Promise<ImageFile> {
    const newImageFile = await this.imageService.saveFile(file);
    return this.getImageFile(newImageFile);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':fileId')
  @ApiOperation({ summary: 'Getting image file' })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not found',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Image file is successfully received',
    type: UploadedImageFileRdo,
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
