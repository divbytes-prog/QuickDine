import { Response } from "express";
import { AuthRequest } from "../middleware/auth.js";
import { Restaurant } from "../models/Restaurant.js";
import { Booking } from "../models/Booking.js";

// Create a new booking
// POST /api/bookings
// @access Private
export const createBooking = async (req: AuthRequest, res:Response): Promise<void> => {
    try {
        const { restaurantId, date, time, guests, occasion, specialRequests } = req.body;

        const requestedGuests = Number(guests);
        const bookingDate = new Date(date);
        if (!restaurantId || !date || !time || !Number.isInteger(requestedGuests) || requestedGuests < 1 || requestedGuests > 20) {
            res.status(400).json({ message: "Please provide a valid restaurant, date, time, and party size" });
            return;
        }
        if (Number.isNaN(bookingDate.getTime())) {
            res.status(400).json({ message: "Please provide a valid booking date" });
            return;
        }

        const restaurant = await Restaurant.findById(restaurantId);
        if(!restaurant){
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

        // Verify seat availability

        const existingBookings = await Booking.find({
          restaurant: restaurantId,
          date: bookingDate,
          time,
          status: "confirmed",
        })

        const bookedSeats = existingBookings.reduce((sum, b)=>sum + b.guests, 0)

        const totalSeats = restaurant.totalSeats || 20;
        const availableSeats = totalSeats - bookedSeats;

        if(requestedGuests > availableSeats){
            res.status(400).json({
                message: `Unable to reserve. Only ${availableSeats} seats are available for this time slot.`,
            })
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
        })

        // Populate restaurant info before returning
        const populatedBooking = await booking.populate("restaurant", "name location image address");

        res.status(201).json(populatedBooking);

    } catch (error: any) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
}

// Get logged in user bookings
// GET /api/bookings/my
// @access Private
export const getMyBookings = async (req: AuthRequest, res:Response): Promise<void> => {
    try {
        const bookings = await Booking.find({user: req.user?._id }).populate("restaurant", "name location image address slug").sort({date: -1, time: -1})

        res.json(bookings);
    } catch (error: any) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
}

// Cancel a booking
// PUT /api/bookings/:id/cancel
// @access Private
export const cancelBooking = async (req: AuthRequest, res:Response): Promise<void> => {
    try {

        const booking = await Booking.findById(req.params.id);

        if (!booking){
            res.status(404).json({ message: "Booking not found" });
            return;
        }

        // Verify user owns the booking
        if(booking.user.toString() !== req.user?._id.toString()){
            res.status(401).json({ message: "Not authorized to cancel this booking" });
            return;
        }

        booking.status = "cancelled";
        await booking.save();

        const populatedBooking = await booking.populate("restaurant", "name location image address")
        res.json(populatedBooking);
    } catch (error: any) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
}
