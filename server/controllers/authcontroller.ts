import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import { AuthRequest } from "../middleware/auth.js";

const generateToken = (id: string) => {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET is not configured");
    return jwt.sign({ id }, secret, { expiresIn: "30d" });
};

const normalizeEmail = (value: unknown) => String(value || "").trim().toLowerCase();

export const registerUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, password, phone, role } = req.body;
        const email = normalizeEmail(req.body.email);
        const cleanName = String(name || "").trim();

        if (!cleanName || !email || !password) {
            res.status(400).json({ message: "Please enter all required fields" });
            return;
        }

        if (String(password).length < 6) {
            res.status(400).json({ message: "Password must be at least 6 characters long" });
            return;
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            res.status(400).json({ message: "User already exists" });
            return;
        }

        const hashedPassword = await bcrypt.hash(String(password), 10);
        const safeRole = role === "owner" ? "owner" : "user";

        const user = await User.create({
            name: cleanName,
            email,
            password: hashedPassword,
            phone: phone ? String(phone).trim() : undefined,
            role: safeRole,
        });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            token: generateToken(user._id.toString()),
        });
    } catch (error: any) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const email = normalizeEmail(req.body.email);
        const { password } = req.body;

        if (!email || !password) {
            res.status(400).json({ message: "Please provide email and password" });
            return;
        }

        const user = await User.findOne({ email });
        if (!user) {
            res.status(401).json({ message: "Invalid email or password" });
            return;
        }

        const isMatch = await bcrypt.compare(String(password), user.password || "");
        if (!isMatch) {
            res.status(401).json({ message: "Invalid email or password" });
            return;
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            token: generateToken(user._id.toString()),
        });
    } catch (error: any) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ message: "Not authorized" });
            return;
        }
        res.json(req.user);
    } catch (error: any) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
};
