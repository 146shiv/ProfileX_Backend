import mongoose, { Schema } from "mongoose";

const BusinessCardSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        name: { type: String, required: true, trim: true },
        designation: { type: String, required: true, trim: true },
        company: { type: String, trim: true },
        email: { type: String, trim: true },
        mobileNumber: { type: String, trim: true },
        website: { type: String, trim: true },
        address: { type: String, trim: true },
        viewCount: { type: Number, default: 0 },
        downloadCount: { type: Number, default: 0 },
    },
    { timestamps: true }
);

export const BusinessCard = mongoose.model("BusinessCard", BusinessCardSchema);
