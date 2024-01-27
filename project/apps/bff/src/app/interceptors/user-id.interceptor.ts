import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

@Injectable()
export class UserIdInterceptor implements NestInterceptor {
  constructor(private readonly propName: string) {
    this.propName = propName ?? 'userId';
  }
  public intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest();
    request.body[this.propName] = request.user.sub;

    return next.handle();
  }
}
