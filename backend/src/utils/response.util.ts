import type { Response } from "express";

export const responseSuccess = (
  res: Response,
  mensaje: string,
  data: any = null,
  code: number = 200
) => {
  return res.status(code).json({
    status: "success",
    mensaje,
    data,
    error: null,
    code,
  });
};

export const responseError = (
  res: Response,
  mensaje: string,
  error: any = null,
  code: number = 500
) => {
  return res.status(code).json({
    status: "error",
    mensaje,
    data: null,
    error,
    code,
  });
};

export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}
