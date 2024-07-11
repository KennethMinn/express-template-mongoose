import { NextFunction, Request, Response } from "express";
import { loginSchema } from "../types/auth/loginSchema";
import { registerSchema } from "../types/auth/registerSchema";
import { ErrorService } from "../services/errorService";

export class AuthValidator {
  constructor(private errorService: ErrorService) {}

  registerValidation(req: Request, res: Response, next: NextFunction) {
    return this.errorService.handleErrorMessage(registerSchema, req, res, next);
  }

  loginValidation(req: Request, res: Response, next: NextFunction) {
    return this.errorService.handleErrorMessage(loginSchema, req, res, next);
  }
}
