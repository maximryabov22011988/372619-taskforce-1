import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { ForeignKeyViolationError } from 'objection';

@Catch(ForeignKeyViolationError)
export class ForeignKeyViolationExceptionFilter implements ExceptionFilter {
  public catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = HttpStatus.BAD_REQUEST;

    response.status(status).json({
      statusCode: status,
      message: 'Foreign key constraint failed',
      detail: exception.message,
    });
  }
}
