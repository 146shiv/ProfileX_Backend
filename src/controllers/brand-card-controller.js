import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async.handler.js";
import { BrandCard } from "../models/brand-card.js";
import QRCode from "qrcode";

const createBrandCard = asyncHandler(async (req, res) => {
    const { brandName, tagline, website, logoUrl, description } = req.body;
    const userId = req.user._id;

    const brandCard = await BrandCard.create({
        userId,
        brandName,
        tagline,
        website,
        logoUrl,
        description,
    });

    const createdCard = await BrandCard.findById(brandCard._id);
    if (!createdCard) {
        throw new ApiError(500, "Something went wrong while creating the brand card");
    }

    return res.status(201).json(
        new ApiResponse(201, { brandCard: createdCard }, "Brand card created successfully")
    );
});

const getMyBrandCard = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const cards = await BrandCard.find({ userId }).sort({ updatedAt: -1 });
    return res.status(200).json(
        new ApiResponse(200, cards, "Brand cards fetched successfully")
    );
});

const updateBrandCard = asyncHandler(async (req, res) => {
    const { CardId } = req.params;
    const userId = req.user._id;
    const { brandName, tagline, website, logoUrl, description } = req.body;

    const card = await BrandCard.findById(CardId);
    if (!card) {
        throw new ApiError(404, "Brand card not found");
    }
    if (card.userId.toString() !== userId.toString()) {
        throw new ApiError(403, "Access denied to this brand card");
    }

    const updates = {};
    if (brandName !== undefined) updates.brandName = brandName;
    if (tagline !== undefined) updates.tagline = tagline;
    if (website !== undefined) updates.website = website;
    if (logoUrl !== undefined) updates.logoUrl = logoUrl;
    if (description !== undefined) updates.description = description;

    const updatedCard = await BrandCard.findByIdAndUpdate(CardId, { $set: updates }, { new: true });
    return res.status(200).json(
        new ApiResponse(200, { brandCard: updatedCard }, "Brand card updated successfully")
    );
});

const deleteBrandCard = asyncHandler(async (req, res) => {
    const { CardId } = req.params;
    const userId = req.user._id;

    const card = await BrandCard.findById(CardId);
    if (!card) {
        throw new ApiError(404, "Brand card not found");
    }
    if (card.userId.toString() !== userId.toString()) {
        throw new ApiError(403, "Access denied to this brand card");
    }

    await BrandCard.findByIdAndDelete(CardId);
    return res.status(200).json(
        new ApiResponse(200, null, "Brand card deleted successfully")
    );
});

const downloadBrandCard = asyncHandler(async (req, res) => {
    const { CardId } = req.params;
    const userId = req.user._id;

    const card = await BrandCard.findById(CardId);
    if (!card) {
        throw new ApiError(404, "Brand card not found");
    }
    if (card.userId.toString() !== userId.toString()) {
        throw new ApiError(403, "Access denied to this brand card");
    }

    card.downloadCount = (card.downloadCount || 0) + 1;
    await card.save({ validateBeforeSave: false });

    const qrData = `${process.env.FRONTEND_URL}/brand-card/${card._id}`;
    const qrCode = await QRCode.toDataURL(qrData);

    return res.status(200).json(
        new ApiResponse(200, { qrCode }, "QR code generated successfully")
    );
});

const scanBrandCard = asyncHandler(async (req, res) => {
    const { CardId } = req.params;

    const cardDetails = await BrandCard.findById(CardId);
    if (!cardDetails) {
        throw new ApiError(404, "Brand card not found");
    }

    cardDetails.viewCount = (cardDetails.viewCount || 0) + 1;
    await cardDetails.save({ validateBeforeSave: false });

    return res.status(200).json(
        new ApiResponse(200, { CardDetails: cardDetails }, "Brand card scanned successfully")
    );
});

export {
    createBrandCard,
    getMyBrandCard,
    updateBrandCard,
    deleteBrandCard,
    downloadBrandCard,
    scanBrandCard,
};
