import "dotenv/config";
import express, { Request, Response, NextFunction } from 'express';
import cors from "cors";
import connectDB from "./config/db.js";
import authRouter from "./routes/authRoutes.js";
import restaurantRouter from "./routes/RestaurantRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import ownerRouter from "./routes/Ownerroutes.js";
import adminRouter from "./routes/adminroutes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.get('/', (_req: Request, res: Response) => {
    res.json({ status: "ok", service: "quickdine-api" });
});

app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ status: "ok", service: "quickdine-api" });
});

// Vercel invokes the exported app as a serverless function. The database is
// connected lazily for API requests so a missing/slow database cannot prevent
// the function from booting or make the local health endpoint hang.
app.use("/api", async (_req: Request, _res: Response, next: NextFunction) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        next(error);
    }
});

app.use("/api/auth", authRouter);
app.use("/api/restaurants", restaurantRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/owner", ownerRouter);
app.use("/api/admin", adminRouter);

// Global Error Handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error("Unhandled error:", err);
    res.status(500).json({
        message: err.message || "Internal Server Error",
        stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
    });
});

// Keep the local development experience, but never call listen inside a
// Vercel function. Vercel sets VERCEL=1 for deployed functions.
if (process.env.VERCEL !== "1") {
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    });
}

export { app };
export default app;
