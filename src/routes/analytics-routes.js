import { Router } from "express";
import { getCardsAnalytics } from "../controllers/analytics-controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/analytics/cards").get(verifyJWT, getCardsAnalytics);

export default router;
