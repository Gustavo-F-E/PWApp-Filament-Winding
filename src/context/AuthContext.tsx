//src/context/AuthContext.tsx

"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
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
        username?: string;
        email?: string;
        password: string;
    }) => Promise<void>;
    register: (data: {
        username: string;
        email: string;
        password: string;
    }) => Promise<void>;
    logout: () => Promise<void>;
    loginWithOAuth: (user: User, token: string) => Promise<void>; // ← AGREGAR
    isLoading: boolean;
};

const AuthContext = createContext<AuthContextType>({
    user: null,
    isLogged: false,
    login: async () => {},
    loginWithOAuth: async () => {},
    register: async () => {},
    logout: async () => {},
    isLoading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        if (mounted) checkSession();
        return () => {
            mounted = false;
        };
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
  
    const saveToken = (token: string) => {
        localStorage.setItem("auth_token", token);
        document.cookie = `auth_token=${token}; path=/; secure; samesite=lax`;
  };
  
const login = useCallback(async (credentials: {
        username?: string;
        email?: string;
        password: string;
    }) => {
        setIsLoading(true);
        try {
            const { user: loggedUser, token } = await loginWithCredentials(
                credentials
            );

            saveToken(token); // ← acá
            setUser(loggedUser);
        } catch (error) {
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const register = useCallback(async (data: {
        username: string;
        email: string;
        password: string;
    }) => {
        setIsLoading(true);
        try {
            const { user: newUser, token } = await registerUser(data);

            saveToken(token); // ← acá también
            setUser(newUser);
        } catch (error) {
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const logout = useCallback(async () => {
        setIsLoading(true);
        try {
            // Intenta logout en el servidor
            await apiLogout();
        } catch (error) {
            // Ignora errores del servidor - el logout local es lo importante
            console.warn("Advertencia (puede ignorarse):", error);
        } finally {
            // SIEMPRE limpia localmente, independientemente del servidor
            localStorage.removeItem("auth_token");
            setUser(null);
            setIsLoading(false);
            console.log("Sesión cerrada localmente");
            // Eliminar cookie con path / para asegurar consistencia
            document.cookie = "auth_token=; Max-Age=0; path=/; SameSite=Lax";
        }
    }, []);

    const loginWithOAuth = useCallback(async (user: User, token: string) => {
        setIsLoading(true);
        try {
            if (!token || !user) throw new Error("OAuth inválido");

            saveToken(token); // ← mismo mecanismo
            setUser(user);
        } finally {
            setIsLoading(false);
        }
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                isLogged: !!user,
                login,
                loginWithOAuth,
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
