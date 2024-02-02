import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { UniqueViolationError } from 'objection';

@Catch(UniqueViolationError)
export class UniqueConstraintExceptionFilter implements ExceptionFilter {
  public catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = HttpStatus.CONFLICT;

    response.status(status).json({
      statusCode: status,
      message: 'Duplicate entry',
      detail: exception.message,
    });
  }
}
