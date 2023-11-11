import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class UploadedImageFileRdo {
  @ApiProperty({
    description: 'Image file unique identifier',
    example: '6454d59863c251ba693cd2e6',
  })
  @Expose()
  public id: string;

  @ApiProperty({
    description: 'Original name',
    example: 'filename.jpg',
  })
  @Expose()
  public originalName: string;

  @ApiProperty({
    description: 'Image file hash',
    example: '54a5eacc-a172-44cd-906a-ad1e52527114.png',
  })
  @Expose()
  public hashName: string;

  @ApiProperty({
    description: 'Mimetype',
    example: 'image/png',
  })
  @Expose()
  public mimetype: string;

  @ApiProperty({
    description: 'Image file size',
    example: '393035',
  })
  @Expose()
  public size: number;

  @ApiProperty({
    description: 'Relative image file path',
    example: '/2023/06/12a5eacc-a172-44cd-906a-ad1352527114.png',
  })
  @Expose()
  public path: string;
}
