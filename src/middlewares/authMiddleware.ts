import { Request, Response, NextFunction } from "express";
import { authService, AuthService } from "../services/authService";

export class AuthMiddleware {
  constructor(private authService: AuthService) {}

  verifyJwtToken(req: Request, res: Response, next: NextFunction) {
    return this.authService.verifyJwtToken(req, res, next);
  }
}

export const authMidlleware = new AuthMiddleware(authService);
