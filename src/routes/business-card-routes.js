import { Router } from "express";
import { businessCardValidator, businessCardUpdateValidator } from "../validators/index.js";
import { validate } from "../middlewares/validation.middleware.js";
import {
    createBusinessCard,
    getMyBusinessCard,
    updateBusinessCard,
    deleteBusinessCard,
    downloadBusinessCard,
    scanBusinessCard,
} from "../controllers/business-card-controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/business-card").post(verifyJWT, businessCardValidator(), validate, createBusinessCard);
router.route("/business-card/my").get(verifyJWT, getMyBusinessCard);
router.route("/business-card/download/:CardId").get(verifyJWT, downloadBusinessCard);
router.route("/business-card/scan/:CardId").get(scanBusinessCard);
router.route("/business-card/:CardId").put(verifyJWT, businessCardUpdateValidator(), validate, updateBusinessCard).delete(verifyJWT, deleteBusinessCard);

export default router;
