import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigImageModule, getMongooseOptions } from '@project/config';
import { ImageModule } from './image/image.module';

@Module({
  imports: [
    ImageModule,
    ConfigImageModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../..', '/uploads/'),
      serveStaticOptions: { index: false },
    }),
    MongooseModule.forRootAsync(getMongooseOptions()),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
