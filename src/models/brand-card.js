import mongoose, { Schema } from "mongoose";

const BrandCardSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        brandName: { type: String, required: true, trim: true },
        tagline: { type: String, trim: true },
        website: { type: String, trim: true },
        logoUrl: { type: String, trim: true },
        description: { type: String, trim: true },
        viewCount: { type: Number, default: 0 },
        downloadCount: { type: Number, default: 0 },
    },
    { timestamps: true }
);

export const BrandCard = mongoose.model("BrandCard", BrandCardSchema);
