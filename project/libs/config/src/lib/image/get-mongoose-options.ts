import { MongooseModuleAsyncOptions } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { getMongoConnection } from '@project/libs/utils-core';

export const getMongooseOptions = (): MongooseModuleAsyncOptions => ({
  useFactory: async (config: ConfigService) => ({
    uri: getMongoConnection({
      username: config.get<string>('db.user'),
      password: config.get<string>('db.password'),
      host: config.get<string>('db.host'),
      port: config.get<number>('db.port'),
      databaseName: config.get<string>('db.name'),
      authDatabase: config.get<string>('db.authBase'),
    }),
  }),
  inject: [ConfigService],
});
