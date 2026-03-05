import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser";

const app = express();

// basic configurations;
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser());

// cors configuration;

const allowedOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(",")
    : [process.env.FRONTEND_URL || "http://localhost:5173", "https://profile-x-zeta.vercel.app"]

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],

}),
);

// import routes;
import authRoutes from "./routes/auth.routes.js";
import vehicleCardRoutes from "./routes/vehicle-card-routes.js";
import businessCardRoutes from "./routes/business-card-routes.js";
import brandCardRoutes from "./routes/brand-card-routes.js";
import analyticsRoutes from "./routes/analytics-routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1", vehicleCardRoutes);
app.use("/api/v1", businessCardRoutes);
app.use("/api/v1", brandCardRoutes);
app.use("/api/v1", analyticsRoutes);

app.use(errorHandler);



export default app;