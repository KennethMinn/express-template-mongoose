import { body } from "express-validator";
import { NextFunction, Request, Response } from "express";
import { loginSchema } from "../types/auth/loginSchema";
import { registerSchema } from "../types/auth/registerSchema";

export class AuthValidator {
  registerValidation(req: Request, res: Response, next: NextFunction) {
    let zodErrors = {};
    const result = registerSchema.safeParse(req.body);

    if (!result.success) {
      result.error.issues.forEach((issue) => {
        zodErrors = { ...zodErrors, [issue.path[0]]: issue.message }; // {title : 'error message'}
      });
    }

    if (Object.keys(zodErrors).length > 0)
      return res.status(400).json({ errors: zodErrors });

    next();
  }
  loginValidation(req: Request, res: Response, next: NextFunction) {
    let zodErrors = {};
    const result = loginSchema.safeParse(req.body);

    if (!result.success) {
      result.error.issues.forEach((issue) => {
        zodErrors = { ...zodErrors, [issue.path[0]]: issue.message }; // {title : 'error message'}
      });
    }

    if (Object.keys(zodErrors).length > 0)
      return res.status(400).json({ errors: zodErrors });

    next();
  }
}
