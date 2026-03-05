import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async.handler.js";
import { VehicleCard } from "../models/vehicle-card.js";
import { BusinessCard } from "../models/business-card.js";
import { BrandCard } from "../models/brand-card.js";

const getCardsAnalytics = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const [vehicleCards, businessCards, brandCards] = await Promise.all([
        VehicleCard.find({ userId }).select("-__v").lean(),
        BusinessCard.find({ userId }).lean(),
        BrandCard.find({ userId }).lean(),
    ]);

    const vehicleWithType = vehicleCards.map((c) => ({ ...c, cardType: "vehicle", cardId: c._id }));
    const businessWithType = businessCards.map((c) => ({ ...c, cardType: "business", cardId: c._id }));
    const brandWithType = brandCards.map((c) => ({ ...c, cardType: "brand", cardId: c._id }));

    const cards = [...vehicleWithType, ...businessWithType, ...brandWithType];

    let totalViews = 0;
    let totalDownloads = 0;
    cards.forEach((c) => {
        totalViews += c.viewCount || 0;
        totalDownloads += c.downloadCount || 0;
    });

    const totalCards = cards.length;

    return res.status(200).json(
        new ApiResponse(200, {
            totalCards,
            totalViews,
            totalDownloads,
            cards,
        }, "Analytics fetched successfully")
    );
});

export { getCardsAnalytics };
