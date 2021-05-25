import { AppLogger } from '@/shared/appLogger/appLogger.service';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { HttpStatus } from '@nestjs/common';
const logger = new AppLogger('App');
export const execOperation = async (func: any) => {
  try {
    return await func();
  } catch (error) {
    logger.error(error + '\n------------------------------------\n', '');
    throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
  }
};
