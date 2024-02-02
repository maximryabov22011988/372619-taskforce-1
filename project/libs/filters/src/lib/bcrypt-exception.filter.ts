import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class BcryptExceptionFilter implements ExceptionFilter {
  public catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();

      const response = exception.getResponse();
      if (typeof response === 'object') {
        message = (response as { message: string }).message;
      } else {
        message = response;
      }
    } else if (exception.message.includes('hash')) {
      status = HttpStatus.UNAUTHORIZED;
      message = 'Incorrect login or password';
    }

    response.status(status).json({
      statusCode: status,
      message: message,
    });
  }
}
