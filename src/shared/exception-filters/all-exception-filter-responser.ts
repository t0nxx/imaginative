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
  constructor(@InjectSentry() private readonly sentryClient: SentryService) {}
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
        exception instanceof HttpException
          ? JSON.stringify(exception.getResponse())
          : JSON.stringify(exception),
      stackTrace: exception.stack,
      body: JSON.stringify(request.body) || null,
      headers: request.headers || null,
      cookies: request.cookies || null,
      clientIp: request.ip || null,
    };

    const respObject = new OperationResult();
    const exceptionResponse: any =
      exception instanceof HttpException
        ? exception.getResponse()
        : ['Internal server error'];
    respObject.success = false;
    // this for unify all err message to be array of errors even it one
    /// retuen array of one message in response
    if (exceptionResponse.message) {
      //// execptions throws from app
      if (typeof exceptionResponse.message == 'string') {
        respObject.message = [exceptionResponse.message];
      } else {
        /// execptions throws from class validator
        respObject.message = [exceptionResponse.message[0]];
      }
    } else {
      /// 500 error not http
      respObject.message = [exception.message] ?? ['Internal server error'];
    }
    respObject.statusCode =
      exception instanceof HttpException
        ? 401
        : HttpStatus.INTERNAL_SERVER_ERROR;

    this.sentryClient.instance().captureException(errObject);
    response.status(401).json(respObject);
  }
}
