import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
  Param,
  Inject,
  UsePipes,
  UseGuards,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiParam,
  ApiInternalServerErrorResponse,
  ApiBadRequestResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { Express } from 'express';
import assign from 'lodash/assign';
import { fillObject } from '@project/libs/utils-core';
import { ImageConfig } from '@project/libs/config';
import { JwtAuthGuard, Roles, RolesGuard } from '@project/libs/validators';
import { ImageFile, UserRoleId } from '@project/libs/shared-types';
import { UploadedImageFileRdo } from '@project/libs/rdo';
import { ApiAuth } from '@project/libs/decorators';
import { ImageService } from './image.service';
import { MongoIdValidationPipe } from './pipes/mongo-id-validation.pipe';
import { FileExtensionValidationPipe } from './pipes/file-extension-validation.pipe';
import { FileSizeValidationPipe } from './pipes/file-size-validation.pipe';

const { appConfig } = ImageConfig;

@Controller({
  path: 'image',
  version: '1',
})
@ApiTags('Image uploader service')
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
  @ApiConsumes('multipart/form-data')
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
  @ApiOkResponse({
    description: 'User avatar file successfully uploaded',
    type: UploadedImageFileRdo,
  })
  @ApiBadRequestResponse({ description: 'Invalid image file size or format' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
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
  @ApiAuth()
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
  @ApiConsumes('multipart/form-data')
  @ApiOkResponse({
    description: 'Image file successfully uploaded',
    type: UploadedImageFileRdo,
  })
  @ApiBadRequestResponse({ description: 'Invalid image file size or format' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  public async uploadImage(
    @UploadedFile() file: Express.Multer.File
  ): Promise<ImageFile> {
    const newImageFile = await this.imageService.saveFile(file);
    return this.getImageFile(newImageFile);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':fileId')
  @ApiAuth()
  @ApiOperation({ summary: 'Getting image file by id' })
  @ApiParam({
    name: 'fileId',
    type: String,
  })
  @ApiOkResponse({
    description: 'Image file successfully received',
    type: UploadedImageFileRdo,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not found' })
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
