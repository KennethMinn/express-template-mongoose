import { NextFunction, Request, Response } from "express";
import { ErrorService } from "../services/errorService";

export class ErrorResponseMiddleware {
  constructor(private errorService: ErrorService) {}

  async handleErrorResponse(req: Request, res: Response, next: NextFunction) {
    return this.errorService.handleErrorMessage(req, res, next);
  }
}
