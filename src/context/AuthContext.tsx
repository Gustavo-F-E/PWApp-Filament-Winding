"use client";

import { createContext, useContext, useState, useEffect } from "react";
import {
    User,
    getSession,
    loginWithCredentials,
    registerUser,
    logout as apiLogout,
} from "@/lib/auth";

type AuthContextType = {
    user: User | null;
    isLogged: boolean;
    login: (credentials: {
        username: string;
        password: string;
    }) => Promise<void>;
    register: (data: {
        username: string;
        email: string;
        password: string;
    }) => Promise<void>;
    logout: () => Promise<void>;
    isLoading: boolean;
};

const AuthContext = createContext<AuthContextType>({
    user: null,
    isLogged: false,
    login: async () => {},
    register: async () => {},
    logout: async () => {},
    isLoading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        checkSession();
    }, []);

    const checkSession = async () => {
        try {
            const sessionUser = await getSession();
            setUser(sessionUser);
        } catch (error) {
            console.error("Error checking session:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (credentials: {
        username: string;
        password: string;
    }) => {
        setIsLoading(true);
        try {
            const { user: loggedUser, token } = await loginWithCredentials(
                credentials
            );
            // Guardar token en localStorage o cookie
            localStorage.setItem("auth_token", token);
            setUser(loggedUser);
        } catch (error) {
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (data: {
        username: string;
        email: string;
        password: string;
    }) => {
        setIsLoading(true);
        try {
            const { user: newUser, token } = await registerUser(data);
            localStorage.setItem("auth_token", token);
            setUser(newUser);
        } catch (error) {
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        setIsLoading(true);
        try {
            await apiLogout();
            localStorage.removeItem("auth_token");
            setUser(null);
        } catch (error) {
            console.error("Error logging out:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLogged: !!user,
                login,
                register,
                logout,
                isLoading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
