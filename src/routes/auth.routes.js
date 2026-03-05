import { Router } from "express";
import { registerUserValidator, loginUserValidator } from "../validators/index.js";
import { registerUser, loginUser, logoutUser, refreshAccessToken } from "../controllers/authcontrollers.js";
import { validate } from "../middlewares/validation.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUserValidator(), validate, registerUser);
router.route("/login").post(loginUserValidator(), validate, loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh").post(refreshAccessToken);

export default router;
