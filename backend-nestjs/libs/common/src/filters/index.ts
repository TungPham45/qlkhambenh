import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // If not HTTP context (e.g. Microservice RPC), rethrow for RPC handler
    if (!response || typeof response.status !== 'function') {
      return exception;
    }

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    if (exception instanceof HttpException) {
      status = exception.getStatus();
    } else if (typeof exception?.status === 'number' && exception.status >= 100 && exception.status <= 599) {
      status = exception.status;
    } else if (typeof exception?.statusCode === 'number' && exception.statusCode >= 100 && exception.statusCode <= 599) {
      status = exception.statusCode;
    }

    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : null;

    let message = exception?.message || 'Internal server error';
    let errors: any = null;

    if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      message = (exceptionResponse as any).message || message;
      errors = (exceptionResponse as any).error || null;
    }

    this.logger.error(`HTTP Status ${status} Error: ${JSON.stringify(message)}`);

    response.status(status).json({
      success: false,
      statusCode: status,
      message: Array.isArray(message) ? message.join(', ') : String(message),
      errors,
      timestamp: new Date().toISOString(),
    });
  }
}
