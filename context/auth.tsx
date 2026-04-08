"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { axiosInstance, setLogoutFunction } from "@/lib/network";
import { usePathname, useRouter } from "next/navigation";

interface AuthContextType {
    loggedIn: boolean;
    user: any;
    login: (data: any) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isLoading, setIsLoading] = useState(true); // Start true to prevent flash of unauth content
    const [loggedIn, setLoggedIn] = useState(false);
    const [user, setUser] = useState<any>(null);
    const router = useRouter();
    
    const fetchUser = useCallback(async () => {
        try {
            const res = await axiosInstance.get("accounts/me/"); // Your Django endpoint
            setUser(res.data);
            setLoggedIn(true);
        } catch (error) {
            logout();
        } finally {
            setIsLoading(false);
        }
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        setLoggedIn(false);
        setUser(null);
        router.push("/");
    }, [router]);

    // Initial load: Check if user is already logged in
    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (token) {
            fetchUser();
        } else {
            setIsLoading(false);
        }
        setLogoutFunction(logout);
    }, [logout, fetchUser]);

    const login = async (credentials: any) => {
        try {
            setIsLoading(true);
            const res = await axiosInstance.post("accounts/login/", credentials);
            const { access, refresh } = res.data;

            localStorage.setItem("access_token", access);
            localStorage.setItem("refresh_token", refresh);
            
            // Critical: Fetch the full user profile (with groups/permissions) after login
            await fetchUser(); 
            
            router.push("/dashboard");
        } catch (error) {
            setIsLoading(false);
            throw error;
        }
    };
    

    return (
        <AuthContext.Provider value={{ loggedIn, user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};