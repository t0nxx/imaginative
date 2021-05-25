import { Response } from 'express';
import { getStatusText, StatusCodes } from 'http-status-codes';

export function endWithInternalServerError(res: Response, err: Error) {
  res.status(StatusCodes.INTERNAL_SERVER_ERROR);
  if (process.env.NODE_ENV === 'production') {
    res.end(getStatusText(StatusCodes.INTERNAL_SERVER_ERROR));
  } else {
    res.send({ errors: [err.message] });
  }
}
