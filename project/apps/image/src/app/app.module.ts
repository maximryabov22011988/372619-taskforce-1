import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { ConfigImageModule, getMongooseOptions } from '@project/config';
import { ImageModule } from './image/image.module';

@Module({
  imports: [
    ImageModule,
    ConfigImageModule,
    ServeStaticModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => [
        {
          rootPath: join(
            process.cwd(),
            configService.get<string>('app.staticPath')
          ),
          serveRoot: configService.get<string>('app.staticServePath'),
        },
      ],
    }),
    MongooseModule.forRootAsync(getMongooseOptions()),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
