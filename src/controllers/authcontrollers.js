import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async.handler.js";
import { User } from "../models/user.models.js";
import jwt from "jsonwebtoken";

const generateAcessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })
        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500,
            "Somethiing went wrong while generating tokens"
        );
    }
};

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, username: bodyUsername, fullName: bodyFullName } = req.body;
    const fullName = bodyFullName || name;
    const username = (bodyUsername || (email && email.split("@")[0]) || "").toLowerCase().replace(/\s/g, "");
    if (!username || username.length < 3) {
        throw new ApiError(400, "Username could not be derived from email; provide a username of at least 3 characters");
    }
    const existingByUsername = await User.findOne({ username });
    if (existingByUsername) {
        throw new ApiError(409, "Username already taken");
    }
    const existingByEmail = await User.findOne({ email: email?.toLowerCase?.() || email });
    if (existingByEmail) {
        throw new ApiError(409, "Email already registered");
    }

    const user = await User.create({
        username,
        fullName,
        email: email?.toLowerCase?.() || email,
        password
    })

    const { unHashedToken, HashedToken, TokenExpiry } =
        user.generateTemporaryToken();

    await user.save({ validateBeforeSave: false });

    const createdUser = await User.findById(user._id).select("-password -refreshToken -__v");

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    return res
        .status(201)
        .json(
            new ApiResponse(201,
                { createdUser },
                "User registered successfully"
            )
        );
});

const loginUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    if (!password) {
        throw new ApiError(400, "Password is required");
    }
    if (!username && !email) {
        throw new ApiError(400, "Username or email is required");
    }

    const user = await User.findOne({
        $or: [
            ...(username ? [{ username: username.toLowerCase() }] : []),
            ...(email ? [{ email: email.toLowerCase?.() || email }] : [])
        ]
    });

    if (!user) {
        throw new ApiError(404, "User does not exists");
    }

    const isPasswordMatched = await user.ComparePassword(password);

    if (!isPasswordMatched) {
        throw new ApiError(401, "Invalid Password");

    }

    const { accessToken, refreshToken } = await generateAcessAndRefreshToken(user._id);

    const loginUser = await User.findById(user._id).select("-password -refreshToken -__v");

    if (!loginUser) {
        throw new ApiError(500, "Something went wrong while logging in the user");
    }


    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loginUser,
                    accessToken,
                    refreshToken
                },
                "User logged in successfully"
            )

        )
});

const logoutUser = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    if (userId) {
        await User.findByIdAndUpdate(
            userId,
            { $set: { refreshToken: null } },
            { new: true }
        );
    }
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    };
    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "Logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
    if (!incomingRefreshToken) {
        throw new ApiError(401, "Refresh token is required");
    }
    try {
        const decoded = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(decoded._id);
        if (!user) {
            throw new ApiError(401, "Invalid refresh token");
        }
        if (user.refreshToken !== incomingRefreshToken) {
            throw new ApiError(401, "Refresh token expired or invalid");
        }
        const { accessToken, refreshToken } = await generateAcessAndRefreshToken(user._id);
        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
        };
        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new ApiResponse(200, { user: await User.findById(user._id).select("-password -refreshToken -__v"), accessToken, refreshToken }, "Access token refreshed")
            );
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token");
    }
});

export { registerUser, loginUser, logoutUser, refreshAccessToken };