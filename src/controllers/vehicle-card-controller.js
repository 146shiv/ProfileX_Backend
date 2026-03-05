import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async.handler.js";
import { VehicleCard } from "../models/vehicle-card.js";
import QRCode from "qrcode";



const createVehicleCard = asyncHandler(async(req,res) =>{
    const 
    {
        
        name,
        designation,
        vehicleNumber,
        vehicleType,
        registrationNumber,
        mobileNumber
    } = req.body;

    const userId = req.user._id;

    const existingCard = await VehicleCard.findOne({
        vehicleNumber:vehicleNumber
    });
    if(existingCard){
        throw new ApiError(409, "Vehicle NUmber already registered");
    }

    const vehicleCard = await VehicleCard.create({
        userId,
        name,
        designation,
        vehicleNumber,
        vehicleType,
        registrationNumber,
        mobileNumber
    });

    await vehicleCard.save({validateBeforeSave:false});

    const createdCard = await VehicleCard.findById(vehicleCard._id).select("-__v");

    if(!createdCard){
        throw new ApiError(500, "Something went wrong while creating the vehicle card");
    }

    return res
    .status(201)
    .json(
        new ApiResponse(200,
            {vehicleCard},
            "Vehicle Card created successfully"
        )
    );
});

const downloadVehicleCard = asyncHandler(async(req,res) =>{
    const {CardId} = req.params;
    const userId = req.user._id;

    const card = await VehicleCard.findById(CardId);

    if(!card){
        throw new ApiError(404, "Vehicle Card not found");
    }

    if(card.userId.toString() !== userId.toString()){
        throw new ApiError(403, "Access denied to this vehicle card");
    }

    card.downloadCount = (card.downloadCount || 0) + 1;
    await card.save({ validateBeforeSave: false });

    const qrData = `${process.env.FRONTEND_URL}/vehicle-card/${card._id}`;
    const qrCode = await QRCode.toDataURL(qrData);

    return res.status(200).json(
        new ApiResponse(200, {qrCode}, "QR Code generated successfully")
    );
});

const scanVehicleCard = asyncHandler(async(req,res) =>{
    const {CardId} = req.params;

    const CardDetails = await VehicleCard.findById(CardId);

    if(!CardDetails){
        throw new ApiError(404, "Vehicle Card not found");
    }

    CardDetails.viewCount = (CardDetails.viewCount || 0) + 1;
    await CardDetails.save({ validateBeforeSave: false });

    return res.status(200).json(
        new ApiResponse(200, {CardDetails}, "Vehicle Card scanned successfully")
    );
});

const getMyVehicleCard = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const cards = await VehicleCard.find({ userId }).sort({ updatedAt: -1 });
  return res.status(200).json(
    new ApiResponse(200, cards, "Vehicle cards fetched successfully")
  );
});

const updateVehicleCard = asyncHandler(async (req, res) => {
  const { CardId } = req.params;
  const userId = req.user._id;
  const { name, designation, vehicleNumber, vehicleType, registrationNumber, mobileNumber, address } = req.body;

  const card = await VehicleCard.findById(CardId);
  if (!card) {
    throw new ApiError(404, "Vehicle Card not found");
  }
  if (card.userId.toString() !== userId.toString()) {
    throw new ApiError(403, "Access denied to this vehicle card");
  }

  const updates = {};
  if (name !== undefined) updates.name = name;
  if (designation !== undefined) updates.designation = designation;
  if (vehicleNumber !== undefined) updates.vehicleNumber = vehicleNumber;
  if (vehicleType !== undefined) updates.vehicleType = vehicleType;
  if (registrationNumber !== undefined) updates.registrationNumber = registrationNumber;
  if (mobileNumber !== undefined) updates.mobileNumber = mobileNumber;
  if (address !== undefined) updates.address = address;

  const updatedCard = await VehicleCard.findByIdAndUpdate(
    CardId,
    { $set: updates },
    { new: true }
  ).select("-__v");

  return res.status(200).json(
    new ApiResponse(200, { vehicleCard: updatedCard }, "Vehicle card updated successfully")
  );
});

const deleteVehicleCard = asyncHandler(async (req, res) => {
  const { CardId } = req.params;
  const userId = req.user._id;

  const card = await VehicleCard.findById(CardId);
  if (!card) {
    throw new ApiError(404, "Vehicle Card not found");
  }
  if (card.userId.toString() !== userId.toString()) {
    throw new ApiError(403, "Access denied to this vehicle card");
  }

  await VehicleCard.findByIdAndDelete(CardId);
  return res.status(200).json(
    new ApiResponse(200, null, "Vehicle card deleted successfully")
  );
});

export { createVehicleCard, downloadVehicleCard, scanVehicleCard, getMyVehicleCard, updateVehicleCard, deleteVehicleCard };