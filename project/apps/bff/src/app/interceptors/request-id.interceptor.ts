import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { v4 as makeUuid } from 'uuid';

export class RequestIdInterceptor implements NestInterceptor {
  public intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Observable<any> {
    const requestUuid = makeUuid();
    const request = context.switchToHttp().getRequest<Request>();
    request.headers['X-Request-Id'] = requestUuid;

    Logger.log(
      `[${request.method}: ${request.url}]: RequestID is ${requestUuid}`
    );
    return next.handle();
  }
}
