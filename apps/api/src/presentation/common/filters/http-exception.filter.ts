import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import type { Request, Response } from 'express';

type ErrorWithCode = { code?: string };

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();
    const code = this.getCode(exception);
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : code === 'P2025'
          ? HttpStatus.NOT_FOUND
          : code === 'P2002'
            ? HttpStatus.CONFLICT
            : HttpStatus.INTERNAL_SERVER_ERROR;
    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : status === HttpStatus.INTERNAL_SERVER_ERROR
          ? 'Internal server error'
          : 'Resource operation failed';

    response.status(status).json({
      statusCode: status,
      message,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }

  private getCode(exception: unknown) {
    if (typeof exception !== 'object' || exception === null) return undefined;
    return (exception as ErrorWithCode).code;
  }
}
