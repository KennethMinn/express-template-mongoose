import { Request, Response, Router } from "express";
import { authController } from "../controllers/authController";
import { authValidator } from "../validators/authValidator";
import { authMidlleware } from "../middlewares/authMiddleware";

const router = Router();

router.get(
  "/test",
  authMidlleware.verifyJwtToken.bind(authMidlleware),
  (req: Request, res: Response) => res.json({ message: "pass" })
);

router.post(
  "/register",
  authValidator.registerValidation.bind(authValidator),
  authController.register.bind(authController)
);

router.post(
  "/login",
  authValidator.loginValidation.bind(authValidator),
  authController.login.bind(authController)
);
router.post("/logout", authController.logout.bind(authController));
router.get("/refresh", authController.refreshToken.bind(authController));

export const authRoutes = router;
