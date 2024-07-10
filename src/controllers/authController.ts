import { Request, Response } from "express";
import { AuthService } from "../services/authService";

export class AuthController {
  constructor(private authService: AuthService) {}

  register(req: Request, res: Response) {
    return this.authService.registerUser(req, res);
  }

  login(req: Request, res: Response) {
    return this.authService.loginUser(req, res);
  }

  logout(req: Request, res: Response) {
    return this.authService.logoutUser(req, res);
  }

  refreshToken(req: Request, res: Response) {
    return this.authService.handleRefresh(req, res);
  }
}
