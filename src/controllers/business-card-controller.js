import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async.handler.js";
import { BusinessCard } from "../models/business-card.js";
import QRCode from "qrcode";

const createBusinessCard = asyncHandler(async (req, res) => {
    const { name, designation, company, email, mobileNumber, website, address } = req.body;
    const userId = req.user._id;

    const businessCard = await BusinessCard.create({
        userId,
        name,
        designation,
        company,
        email,
        mobileNumber,
        website,
        address,
    });

    const createdCard = await BusinessCard.findById(businessCard._id);
    if (!createdCard) {
        throw new ApiError(500, "Something went wrong while creating the business card");
    }

    return res.status(201).json(
        new ApiResponse(201, { businessCard: createdCard }, "Business card created successfully")
    );
});

const getMyBusinessCard = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const cards = await BusinessCard.find({ userId }).sort({ updatedAt: -1 });
    return res.status(200).json(
        new ApiResponse(200, cards, "Business cards fetched successfully")
    );
});

const updateBusinessCard = asyncHandler(async (req, res) => {
    const { CardId } = req.params;
    const userId = req.user._id;
    const { name, designation, company, email, mobileNumber, website, address } = req.body;

    const card = await BusinessCard.findById(CardId);
    if (!card) {
        throw new ApiError(404, "Business card not found");
    }
    if (card.userId.toString() !== userId.toString()) {
        throw new ApiError(403, "Access denied to this business card");
    }

    const updates = {};
    if (name !== undefined) updates.name = name;
    if (designation !== undefined) updates.designation = designation;
    if (company !== undefined) updates.company = company;
    if (email !== undefined) updates.email = email;
    if (mobileNumber !== undefined) updates.mobileNumber = mobileNumber;
    if (website !== undefined) updates.website = website;
    if (address !== undefined) updates.address = address;

    const updatedCard = await BusinessCard.findByIdAndUpdate(CardId, { $set: updates }, { new: true });
    return res.status(200).json(
        new ApiResponse(200, { businessCard: updatedCard }, "Business card updated successfully")
    );
});

const deleteBusinessCard = asyncHandler(async (req, res) => {
    const { CardId } = req.params;
    const userId = req.user._id;

    const card = await BusinessCard.findById(CardId);
    if (!card) {
        throw new ApiError(404, "Business card not found");
    }
    if (card.userId.toString() !== userId.toString()) {
        throw new ApiError(403, "Access denied to this business card");
    }

    await BusinessCard.findByIdAndDelete(CardId);
    return res.status(200).json(
        new ApiResponse(200, null, "Business card deleted successfully")
    );
});

const downloadBusinessCard = asyncHandler(async (req, res) => {
    const { CardId } = req.params;
    const userId = req.user._id;

    const card = await BusinessCard.findById(CardId);
    if (!card) {
        throw new ApiError(404, "Business card not found");
    }
    if (card.userId.toString() !== userId.toString()) {
        throw new ApiError(403, "Access denied to this business card");
    }

    card.downloadCount = (card.downloadCount || 0) + 1;
    await card.save({ validateBeforeSave: false });

    const qrData = `${process.env.FRONTEND_URL}/business-card/${card._id}`;
    const qrCode = await QRCode.toDataURL(qrData);

    return res.status(200).json(
        new ApiResponse(200, { qrCode }, "QR code generated successfully")
    );
});

const scanBusinessCard = asyncHandler(async (req, res) => {
    const { CardId } = req.params;

    const cardDetails = await BusinessCard.findById(CardId);
    if (!cardDetails) {
        throw new ApiError(404, "Business card not found");
    }

    cardDetails.viewCount = (cardDetails.viewCount || 0) + 1;
    await cardDetails.save({ validateBeforeSave: false });

    return res.status(200).json(
        new ApiResponse(200, { CardDetails: cardDetails }, "Business card scanned successfully")
    );
});

export {
    createBusinessCard,
    getMyBusinessCard,
    updateBusinessCard,
    deleteBusinessCard,
    downloadBusinessCard,
    scanBusinessCard,
};
