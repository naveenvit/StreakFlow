"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

interface User {
    _id: string;
    name: string;
    email: string;
    token?: string;
}

interface AuthContextType {
    user: User | null;
    login: (userData: User) => void;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const userCookie = Cookies.get("user");
        if (userCookie) {
            try {
                const parsedUser = JSON.parse(userCookie);
                setUser(parsedUser);
            } catch (e) {
                console.error("Failed to parse user cookie", e);
            }
        }
        setLoading(false);
    }, []);

    const login = (userData: User) => {
        setUser(userData);
        if (userData.token) {
            Cookies.set("token", userData.token, { expires: 30 });
            Cookies.set("user", JSON.stringify(userData), { expires: 30 });
        }
        router.push("/planner");
    };

    const logout = () => {
        setUser(null);
        Cookies.remove("token");
        Cookies.remove("user");
        router.push("/");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};
