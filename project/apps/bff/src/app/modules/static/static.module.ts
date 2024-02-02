import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ImageUploaderProxy } from './proxy.config';

@Module({})
export class StaticModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(ImageUploaderProxy).forRoutes({
      path: '/api/static/*.(jpg|jpeg|png)',
      method: RequestMethod.GET,
    });
  }
}
