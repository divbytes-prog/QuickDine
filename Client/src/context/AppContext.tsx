/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { api } from "../lib/api.js";
import toast from "react-hot-toast";

interface UserType {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    role: "user" | "admin" | "owner";
}

interface AppContextType {
    user: UserType | null;
    token: string | null;
    loading: boolean;
    isAuthenticated: boolean;
    isAuthModalOpen: boolean;
    setAuthModalOpen: (open: boolean) => void;
    login: (email: string, password: string) => Promise<boolean>;
    register: (name: string, email: string, password: string, phone?: string, role?: string)
        => Promise<boolean>;
    logout: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

interface Props {
    children: React.ReactNode;
}

export const AppContextProvider = ({ children }: Props) => {
    const [user, setUser] = useState<UserType | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
    const [loading, setLoading] = useState<boolean>(true);
    const [isAuthModalOpen, setAuthModalOpen] = useState<boolean>(false);

    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            setLoading(true);
            const res = await api.post("/auth/login", { email, password });
            const payload = res.data ?? {};
            const {token: userToken, ...userData} = payload;

            if (!userToken) {
                throw new Error("Login failed. Please try again.");
            }

            localStorage.setItem("token", userToken)
            setToken(userToken)
            setUser(userData)
            toast.success(`Welcome back, ${userData.name}`)
            return true;
        } catch (error: any) {
            toast.error(error?.response?.data?.message || error?.message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const register = async (name: string, email: string, password: string, phone?: string,
    role?: string): Promise<boolean> => {
        try {
            setLoading(true);
            const registerPayload: any = {
                name,
                email,
                password,
                phone,
                role,
            };
            const res = await api.post("/auth/register", registerPayload);
            const payload = res.data ?? {};
            const {token: userToken, ...userData} = payload;

            if (!userToken) {
                throw new Error("Registration failed. Please try again.");
            }

            localStorage.setItem("token", userToken)
            setToken(userToken)
            setUser(userData)
            toast.success(`Welcome to QuickDine Club!`)
            return true;
        } catch (error: any) {
            toast.error(error?.response?.data?.message || error?.message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const logout = useCallback(() => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
        window.location.href = "/";
    }, []);

    useEffect(() => {
        const loadUser = async () => {
            if (token && !user) {
                try {
                    const res = await api.get("/auth/me");
                    const userData = res.data ?? null;
                    setUser(userData);
                } catch (error: any) {
                    toast.error(error?.response?.data?.message || error?.message);
                    logout();
                }
            }
            setLoading(false);
        };
        loadUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token, logout]);

    const value: AppContextType = {
        user,
        token,
        loading,
        isAuthenticated: !!user,
        isAuthModalOpen,
        setAuthModalOpen,
        login,
        register,
        logout,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useAppContext must be used within AppContextProvider");
    }
    return context;
};
