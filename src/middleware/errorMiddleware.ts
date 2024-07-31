import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../utils/customError';

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);

  if (err instanceof CustomError) {
    return res.status(err.statusCode).json(err.message);
  }

  res.status(500).json(err.message);

  // res
  //   .status(500)
  //   .json({ message: 'Internal Server Error', error: err.message });
};
