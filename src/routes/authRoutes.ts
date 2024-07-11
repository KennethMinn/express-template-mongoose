import { Router } from "express";
import { AuthService } from "../services/authService";
import { AuthController } from "../controllers/authController";
import { ErrorService } from "../services/errorService";
import { AuthValidator } from "../validators/authValidator";

const authService = new AuthService();
const authController = new AuthController(authService);
const errorService = new ErrorService();
const authValidator = new AuthValidator(errorService);

const router = Router();
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

export default router;
