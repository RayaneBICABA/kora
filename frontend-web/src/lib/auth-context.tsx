"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authAPI, User } from "./api";

interface AuthContextType {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    login: (email: string, motDePasse: string) => Promise<void>;
    register: (data: {
        nom: string;
        prenom: string;
        email: string;
        motDePasse: string;
        role?: string;
        universite?: string;
    }) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check for stored auth data on mount
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (storedToken && storedUser) {
            setToken(storedToken);
            try {
                setUser(JSON.parse(storedUser));
            } catch {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
            }
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string, motDePasse: string) => {
        const response = await authAPI.login(email, motDePasse);
        const { user: userData, token: authToken } = response;

        // Store auth data
        localStorage.setItem("token", authToken);
        localStorage.setItem("user", JSON.stringify(userData));

        setToken(authToken);
        setUser(userData);
    };

    const register = async (data: {
        nom: string;
        prenom: string;
        email: string;
        motDePasse: string;
        role?: string;
        universite?: string;
    }) => {
        const response = await authAPI.register(data);
        const { user: userData, token: authToken } = response;

        // Store auth data
        localStorage.setItem("token", authToken);
        localStorage.setItem("user", JSON.stringify(userData));

        setToken(authToken);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isLoading,
                login,
                register,
                logout,
                isAuthenticated: !!token && !!user,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
