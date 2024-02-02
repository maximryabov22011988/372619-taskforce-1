import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  Logger,
} from '@nestjs/common';
import { v4 as makeUuid } from 'uuid';

export class RequestIdInterceptor implements NestInterceptor {
  public intercept(context: ExecutionContext, next: CallHandler) {
    const requestUuid = makeUuid();
    const request = context.switchToHttp().getRequest<Request>();
    request.headers['X-Request-Id'] = requestUuid;

    Logger.log(
      `[${request.method}: ${request.url}]: RequestID is ${requestUuid}`
    );
    return next.handle();
  }
}
