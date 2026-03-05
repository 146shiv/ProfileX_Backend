import mongoose, {Schema} from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { timeStamp } from "console";

const VehicleCardSchema = new Schema(
    {
         
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
             
        },
        name:{
            type:String,
            required:true,
            trim:true
        },
        designation:{
            type:String,
            required:true,
            trim:true
        },
        vehicleNumber:{
            type:Number,
            required:true,
            unique:true,
        },
        vehicleType:{
            type:String,
            required:true,
            trim:true
        },
        registrationNumber:{
            type:String,
            required:true,
            
        },
        mobileNumber:{
            type:Number,
            required:true,
            unique:true,
        },
        address:{
            type:String,
            required:false,
            trim:true
        },
        viewCount: { type: Number, default: 0 },
        downloadCount: { type: Number, default: 0 }
    },
     {
        timestamps:true
    }
);
export const VehicleCard = mongoose.model("VehicleCard", VehicleCardSchema);