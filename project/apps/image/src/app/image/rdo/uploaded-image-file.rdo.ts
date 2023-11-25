import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';

export class UploadedImageFileRdo {
  @ApiProperty({
    description: "File's unique identifier.",
    example: '6454d59863c251ba693cd2e6',
  })
  @Expose({ name: '_id' })
  @Transform(({ obj }) => obj._id.toString())
  public id: string;

  @ApiProperty({
    description: 'Image file name',
    example: 'specification-1a9f2b32-7f87-490c-9c56-0c4a78b89791.jpg',
  })
  @Expose()
  public name: string;

  @ApiProperty({
    description: 'Original image file name',
    example: 'specification.jpg',
  })
  @Expose()
  public originalName: string;
}
