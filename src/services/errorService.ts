import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";

export class ErrorService {
  handleErrorMessage(
    schema: ZodSchema,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    let zodErrors = {};
    const result = schema.safeParse(req.body);

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
