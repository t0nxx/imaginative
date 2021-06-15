/* eslint-disable @typescript-eslint/no-empty-function */
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { InjectSentry, SentryService } from '@ntegral/nestjs-sentry';
import OperationResult from '@/shared/models/OperationResult';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(@InjectSentry() private readonly sentryClient: SentryService) { }
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // here to log all execptions / errors
    const errObject = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      error:
        JSON.stringify(exception.getResponse()) ||
        'No error message set for this error',
      stackTrace: exception.stack,
      body: JSON.stringify(request.body) || null,
      headers: request.headers || null,
      cookies: request.cookies || null,
      clientIp: request.ip || null,
    };

    const respObject = new OperationResult();
    const exceptionResponse: any = exception.getResponse();

    respObject.success = false;
    // this for unify all err message to be array of errors even it one
    respObject.message = exceptionResponse.message ?? [exception.message];
    respObject.statusCode = exception.getStatus();

    this.sentryClient.instance().captureException(errObject);
    response.status(status).json(respObject);
  }
}
