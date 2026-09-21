import { Response } from "express";
import { AuthRequest } from "../middleware/auth.js";
import { Restaurant } from "../models/Restaurant.js";
import { Booking } from "../models/Booking.js";

const parseDateOnly = (value: unknown): Date | null => {
    const text = String(value || "");
    if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) return null;
    const parsed = new Date(`${text}T00:00:00.000Z`);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export const createBooking = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { restaurantId, date, time, guests, occasion, specialRequests } = req.body;
        const requestedGuests = Number(guests);
        const bookingDate = parseDateOnly(date);

        if (!restaurantId || !bookingDate || !time || !Number.isInteger(requestedGuests) || requestedGuests < 1 || requestedGuests > 20) {
            res.status(400).json({ message: "Please provide a valid restaurant, date, time, and party size" });
            return;
        }

        const today = new Date();
        const todayUtc = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
        if (bookingDate < todayUtc) {
            res.status(400).json({ message: "Reservation date cannot be in the past" });
            return;
        }

        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
            res.status(404).json({ message: "Restaurant not found" });
            return;
        }

        if (restaurant.status !== "approved") {
            res.status(400).json({ message: "Reservations are not open for this restaurant yet" });
            return;
        }

        if (!restaurant.availableSlots.includes(time)) {
            res.status(400).json({ message: "Please select an available reservation time" });
            return;
        }

        const existingBookings = await Booking.find({
            restaurant: restaurantId,
            date: bookingDate,
            time,
            status: "confirmed",
        });

        const bookedSeats = existingBookings.reduce((sum, existing) => sum + existing.guests, 0);
        const totalSeats = restaurant.totalSeats || 20;
        const availableSeats = Math.max(0, totalSeats - bookedSeats);

        if (requestedGuests > availableSeats) {
            res.status(400).json({
                message: availableSeats > 0
                    ? `Unable to reserve. Only ${availableSeats} seats are available for this time slot.`
                    : "This reservation time is fully booked.",
            });
            return;
        }

        const booking = await Booking.create({
            user: req.user?._id,
            restaurant: restaurantId,
            date: bookingDate,
            time,
            guests: requestedGuests,
            occasion,
            specialRequests,
            status: "confirmed",
        });

        const populatedBooking = await booking.populate("restaurant", "name location image address slug");
        res.status(201).json(populatedBooking);
    } catch (error: any) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
};

export const getMyBookings = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const bookings = await Booking.find({ user: req.user?._id })
            .populate("restaurant", "name location image address slug")
            .sort({ date: -1, time: -1 });
        res.json(bookings);
    } catch (error: any) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
};

export const cancelBooking = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            res.status(404).json({ message: "Booking not found" });
            return;
        }

        if (booking.user.toString() !== req.user?._id.toString()) {
            res.status(401).json({ message: "Not authorized to cancel this booking" });
            return;
        }

        if (booking.status !== "confirmed") {
            res.status(400).json({ message: `This booking is already ${booking.status}` });
            return;
        }

        booking.status = "cancelled";
        await booking.save();

        const populatedBooking = await booking.populate("restaurant", "name location image address slug");
        res.json(populatedBooking);
    } catch (error: any) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
};
