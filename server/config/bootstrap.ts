import bcrypt from "bcrypt";
import crypto from "crypto";
import { Restaurant } from "../models/Restaurant.js";
import { User } from "../models/user.js";

interface DemoRestaurant {
    name: string;
    slug: string;
    cuisine: string;
    priceRange: "$" | "$$" | "$$$" | "$$$$";
    rating: number;
    reviewCount: number;
    location: string;
    address: string;
    image: string;
    chef: string;
    featured: boolean;
    exclusive: boolean;
    totalSeats: number;
    tags: string[];
    availableSlots: string[];
    description: string;
}

const demoRestaurants: DemoRestaurant[] = [
    {
        name: "L'Essence", slug: "l-essence", cuisine: "French", priceRange: "$$$$",
        rating: 4.9, reviewCount: 88, location: "Manhattan, NY",
        address: "115 Greenwich St, New York, NY 10006", image: "/restaurant_5.png",
        chef: "Jean-Luc Picard", featured: true, exclusive: false, totalSeats: 36,
        tags: ["Romantic", "Candlelit", "Haute Cuisine"],
        availableSlots: ["18:00", "19:00", "20:00", "21:00", "22:00"],
        description: "An intimate Parisian-inspired dining room serving modern French cuisine with classic technique."
    },
    {
        name: "Terraza Cielo", slug: "terraza-cielo", cuisine: "Italian", priceRange: "$$$",
        rating: 4.7, reviewCount: 205, location: "Manhattan, NY",
        address: "244 Fifth Ave Rooftop, New York, NY 10001", image: "/restaurant_3.jpg",
        chef: "Elena Rossi", featured: true, exclusive: false, totalSeats: 48,
        tags: ["Rooftop", "Skyline Views", "Handmade Pasta"],
        availableSlots: ["12:00", "13:00", "17:00", "18:00", "19:00", "20:00", "21:00"],
        description: "A rooftop Italian and Mediterranean restaurant with handmade pasta, coastal seafood, and skyline views."
    },
    {
        name: "Kuro Omakase", slug: "kuro-omakase", cuisine: "Japanese", priceRange: "$$$$",
        rating: 4.8, reviewCount: 92, location: "Manhattan, NY",
        address: "18 Orchard St, New York, NY 10002", image: "/restaurant_2.jpg",
        chef: "Kenji Sato", featured: true, exclusive: true, totalSeats: 20,
        tags: ["Omakase", "Japanese", "Zen Atmosphere"], availableSlots: ["18:00", "20:30"],
        description: "A focused seasonal sushi omakase served at an intimate chef's counter."
    },
    {
        name: "Flora Garden", slug: "flora-garden", cuisine: "Vegetarian", priceRange: "$$$",
        rating: 4.8, reviewCount: 110, location: "Manhattan, NY",
        address: "90 Grand St, New York, NY 10013", image: "/restaurant_6.png",
        chef: "Chloe Mercer", featured: false, exclusive: false, totalSeats: 40,
        tags: ["Plant-Based", "Glasshouse", "Organic"],
        availableSlots: ["11:30", "13:00", "14:30", "17:30", "19:00", "20:30"],
        description: "A bright conservatory celebrating organic, seasonal, plant-forward cooking."
    },
    {
        name: "Ember Grille", slug: "ember-grille", cuisine: "Steakhouse", priceRange: "$$$$",
        rating: 4.6, reviewCount: 142, location: "Manhattan, NY",
        address: "320 Bowery, New York, NY 10012", image: "/restaurant_1.png",
        chef: "Marcus Vance", featured: false, exclusive: false, totalSeats: 54,
        tags: ["Dry-Aged Beef", "Wood Fire", "Wine Room"],
        availableSlots: ["17:00", "18:00", "19:00", "20:00", "21:00", "22:00"],
        description: "A modern steakhouse serving dry-aged cuts cooked over live hickory and cherrywood embers."
    },
    {
        name: "L'Artiste", slug: "l-artiste", cuisine: "French", priceRange: "$$$$",
        rating: 4.9, reviewCount: 124, location: "Manhattan, NY",
        address: "420 Mercer St, New York, NY 10003", image: "/restaurant_4.png",
        chef: "Jean-Pierre Dubois", featured: true, exclusive: true, totalSeats: 32,
        tags: ["Fine Dining", "Tasting Menu", "Romantic"],
        availableSlots: ["17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00"],
        description: "An avant-garde French tasting experience combining classic technique with contemporary presentation."
    }
];

let bootstrapPromise: Promise<void> | undefined;

export function ensureDemoData(): Promise<void> {
    if (bootstrapPromise) return bootstrapPromise;

    bootstrapPromise = (async () => {
        const randomPassword = await bcrypt.hash(crypto.randomBytes(32).toString("hex"), 10);
        const owner = await User.findOneAndUpdate(
            { email: "demo-owner@quickdine.app" },
            { $setOnInsert: { name: "QuickDine Demo Owner", password: randomPassword, role: "owner" } },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        await Restaurant.bulkWrite(demoRestaurants.map((restaurant) => ({
            updateOne: {
                filter: { slug: restaurant.slug },
                update: {
                    $set: { ...restaurant, status: "approved" },
                    $setOnInsert: { owner: owner._id }
                },
                upsert: true
            }
        })));
    })().catch((error) => {
        bootstrapPromise = undefined;
        throw error;
    });

    return bootstrapPromise;
}
