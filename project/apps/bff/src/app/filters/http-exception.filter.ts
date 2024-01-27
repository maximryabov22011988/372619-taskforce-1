import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { AxiosError } from 'axios';
import isObject from 'lodash/isObject';

const INTERNAL_SERVER_ERROR_MESSAGE = 'Internal server error';
const EXTERNAL_SERVER_ERROR_MESSAGE = 'External service error';

@Catch(AxiosError)
export class HttpExceptionFilter implements ExceptionFilter {
  public catch(exception: HttpException | AxiosError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status: HttpStatus;
    let message: string | object | unknown;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.getResponse();
    } else if (exception.isAxiosError) {
      status = exception.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;
      message =
        isObject(exception.response?.data) &&
        'message' in exception.response.data
          ? exception.response?.data?.message
          : exception.response?.data || EXTERNAL_SERVER_ERROR_MESSAGE;
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = INTERNAL_SERVER_ERROR_MESSAGE;
    }

    response.status(status).json({
      statusCode: status,
      message,
    });
  }
}
