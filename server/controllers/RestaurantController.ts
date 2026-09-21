import { Request, Response } from "express";
import { Restaurant } from "../models/Restaurant.js";
import { Booking } from "../models/Booking.js";
import { User } from "../models/user.js";
import jwt from "jsonwebtoken";

const parseDateOnly = (value: unknown): Date | null => {
    const text = String(value || "");
    if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) return null;
    const parsed = new Date(`${text}T00:00:00.000Z`);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export const getRestaurants = async (req: Request, res: Response): Promise<void> => {
    try {
        const { search, cuisine, priceRange, rating, location, sort } = req.query;
        const queryObj: any = { status: "approved" };

        if (search) {
            queryObj.$or = [
                { name: { $regex: search, $options: "i" } },
                { cuisine: { $regex: search, $options: "i" } },
                { tags: { $regex: search, $options: "i" } },
                { location: { $regex: search, $options: "i" } },
            ];
        }

        if (priceRange) {
            const prices = Array.isArray(priceRange) ? priceRange : [priceRange];
            queryObj.priceRange = { $in: prices };
        }

        if (cuisine) {
            const cuisines = Array.isArray(cuisine) ? cuisine : [cuisine];
            queryObj.cuisine = { $in: cuisines };
        }

        if (rating) {
            const minRating = Number(rating);
            if (Number.isFinite(minRating)) queryObj.rating = { $gte: minRating };
        }

        if (location) queryObj.location = { $regex: location as string, $options: "i" };

        let sortOption: any = { createdAt: -1 };
        if (sort === "rating") sortOption = { rating: -1 };
        else if (sort === "price_low") sortOption = { priceRange: 1 };
        else if (sort === "price_high") sortOption = { priceRange: -1 };

        const restaurants = await Restaurant.find(queryObj).sort(sortOption);
        res.json(restaurants);
    } catch (error: any) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
};

export const getFeaturedRestaurants = async (_req: Request, res: Response): Promise<void> => {
    try {
        const featured = await Restaurant.find({
            status: "approved",
            $or: [{ featured: true }, { exclusive: true }],
        }).limit(6);
        res.json(featured);
    } catch (error) {
        console.error("Get Featured Restaurants Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const getRestaurantBySlug = async (req: Request, res: Response): Promise<void> => {
    try {
        const restaurant = await Restaurant.findOne({ slug: req.params.slug });
        if (!restaurant) {
            res.status(404).json({ message: "Restaurant not found" });
            return;
        }

        if (restaurant.status !== "approved") {
            let isAuthorized = false;
            if (req.headers.authorization?.startsWith("Bearer ")) {
                try {
                    const secret = process.env.JWT_SECRET;
                    if (!secret) throw new Error("JWT_SECRET is not configured");
                    const token = req.headers.authorization.split(" ")[1];
                    const decoded = jwt.verify(token, secret) as { id: string };
                    const user = await User.findById(decoded.id);
                    if (
                        user &&
                        (user.role === "admin" ||
                            (user.role === "owner" && restaurant.owner.toString() === user._id.toString()))
                    ) {
                        isAuthorized = true;
                    }
                } catch {
                    isAuthorized = false;
                }
            }

            if (!isAuthorized) {
                res.status(404).json({ message: "Restaurant not found or pending approval" });
                return;
            }
        }

        res.json(restaurant);
    } catch (error: any) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
};

export const getRestaurantAvailability = async (req: Request, res: Response): Promise<void> => {
    try {
        const bookingDate = parseDateOnly(req.query.date);
        if (!bookingDate) {
            res.status(400).json({ message: "Please provide a valid date" });
            return;
        }

        const restaurant = await Restaurant.findById(req.params.id);
        if (!restaurant || restaurant.status !== "approved") {
            res.status(404).json({ message: "Restaurant not found" });
            return;
        }

        const today = new Date();
        const todayUtc = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
        if (bookingDate < todayUtc) {
            res.status(400).json({ message: "Reservation date cannot be in the past" });
            return;
        }

        const bookings = await Booking.find({
            restaurant: restaurant._id,
            date: bookingDate,
            status: "confirmed",
        });

        const availability = restaurant.availableSlots.map((slot) => {
            const bookedSeats = bookings
                .filter((booking) => booking.time === slot)
                .reduce((sum, booking) => sum + booking.guests, 0);
            const totalSeats = restaurant.totalSeats || 20;
            const availableSeats = Math.max(0, totalSeats - bookedSeats);

            return { time: slot, availableSeats, isAvailable: availableSeats > 0 };
        });

        res.json(availability);
    } catch (error: any) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
};
