import mongoose from "mongoose";
import { ensureDemoData } from "./bootstrap.js";

let connectionPromise: Promise<void> | undefined;

/**
 * Reuse one connection across Vercel function invocations. Mongoose keeps the
 * underlying socket alive, while the promise prevents concurrent requests
 * from opening multiple connections during a cold start.
 */
const connectDB = async (): Promise<void> => {
    if (mongoose.connection.readyState === 1) return;
    if (connectionPromise) return connectionPromise;

    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error("MONGODB_URI is not configured");

    if (mongoose.connection.listenerCount("connected") === 0) {
        mongoose.connection.on("connected", () => console.log("MongoDB Connected"));
    }

    connectionPromise = mongoose.connect(uri)
        .then(async () => ensureDemoData())
        .catch((error) => {
            connectionPromise = undefined;
            throw error;
        });

    return connectionPromise;
};

export default connectDB;
