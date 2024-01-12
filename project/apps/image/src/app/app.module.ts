import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ImageConfig } from '@project/libs/config';
import { JwtModule } from '@project/libs/modules';
import { ImageModule } from './image/image.module';

const { getMongooseOptions } = ImageConfig;

@Module({
  imports: [
    JwtModule,
    ImageModule,
    MongooseModule.forRootAsync(getMongooseOptions()),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
