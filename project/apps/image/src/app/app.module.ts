import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@project/libs/modules';
import { getMongooseOptions } from '@project/libs/utils-core';
import { ImageModule } from './image/image.module';

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
