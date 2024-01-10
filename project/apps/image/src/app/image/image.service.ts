import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { ensureDir } from 'fs-extra';
import { extension } from 'mime-types';
import { v4 as makeUuid } from 'uuid';
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { cwd } from 'node:process';
import { DateTimeService } from '@project/libs/services';
import { ImageConfig } from '@project/libs/config';
import { ImageFile } from '@project/libs/shared-types';
import { ImageRepository } from './image.repository';

const { appConfig } = ImageConfig;

type WritedImageFile = {
  hashName: string;
  fileExtension: string;
  subDirectory: string;
  path: string;
};

@Injectable()
export class ImageService {
  constructor(
    private readonly imageRepository: ImageRepository,
    private readonly dateTime: DateTimeService,

    @Inject(appConfig.KEY)
    private readonly applicationConfig: ConfigType<typeof appConfig>
  ) {}

  public async getFile(fileId: string): Promise<ImageFile> {
    const existImageFile = await this.imageRepository.findById(fileId);
    if (!existImageFile) {
      throw new NotFoundException(`File with ${fileId} not found`);
    }

    return existImageFile;
  }

  public async saveFile(file: Express.Multer.File): Promise<ImageFile> {
    const writedFile = await this.writeFile(file);

    return this.imageRepository.create({
      originalName: file.originalname,
      name: writedFile.hashName,
      mimetype: file.mimetype,
      path: writedFile.path,
      size: file.size,
    });
  }

  private async writeFile(file: Express.Multer.File): Promise<WritedImageFile> {
    const fileName = makeUuid();
    const fileExtension = extension(file.mimetype) as string;
    const writedFile = `${fileName}.${fileExtension}`;

    const [year, month] = this.dateTime
      .getFormattedDate(new Date(), 'YYYY MM')
      .split(' ');
    const subDirectory = `${year}/${month}`;

    const uploadDirectoryPath = join(
      cwd(),
      this.applicationConfig.uploadDirectory,
      year,
      month
    );
    const destinationFile = join(uploadDirectoryPath, writedFile);

    await ensureDir(uploadDirectoryPath);
    await writeFile(destinationFile, file.buffer);

    return {
      hashName: fileName,
      fileExtension,
      subDirectory,
      path: `/${subDirectory}/${writedFile}`,
    };
  }
}
