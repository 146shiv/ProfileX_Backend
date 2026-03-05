import { Router } from 'express';
import { vehicleCardValidator, vehicleCardUpdateValidator } from '../validators/index.js';
import { validate } from '../middlewares/validation.middleware.js';
import { createVehicleCard, downloadVehicleCard, scanVehicleCard, getMyVehicleCard, updateVehicleCard, deleteVehicleCard } from '../controllers/vehicle-card-controller.js';
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route('/vehicle-card').post(verifyJWT, vehicleCardValidator(), validate, createVehicleCard);
router.route('/vehicle-card/my').get(verifyJWT, getMyVehicleCard);
router.route('/vehicle-card/download/:CardId').get(verifyJWT, downloadVehicleCard);
router.route('/vehicle-card/scan/:CardId').get(scanVehicleCard);
router.route('/vehicle-card/:CardId').put(verifyJWT, vehicleCardUpdateValidator(), validate, updateVehicleCard).delete(verifyJWT, deleteVehicleCard);

export default router;