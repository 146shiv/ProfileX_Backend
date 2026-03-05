import { Router } from "express";
import { brandCardValidator, brandCardUpdateValidator } from "../validators/index.js";
import { validate } from "../middlewares/validation.middleware.js";
import {
    createBrandCard,
    getMyBrandCard,
    updateBrandCard,
    deleteBrandCard,
    downloadBrandCard,
    scanBrandCard,
} from "../controllers/brand-card-controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/brand-card").post(verifyJWT, brandCardValidator(), validate, createBrandCard);
router.route("/brand-card/my").get(verifyJWT, getMyBrandCard);
router.route("/brand-card/download/:CardId").get(verifyJWT, downloadBrandCard);
router.route("/brand-card/scan/:CardId").get(scanBrandCard);
router.route("/brand-card/:CardId").put(verifyJWT, brandCardUpdateValidator(), validate, updateBrandCard).delete(verifyJWT, deleteBrandCard);

export default router;
