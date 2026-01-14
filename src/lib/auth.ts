// src/lib/auth.ts

//const API_BASE_URL = "https://fast-api-filpath.vercel.app";
// Para desarrollo local
const API_BASE_URL = process.env.NEXT_PUBLIC_URL_BACKEND || "http://localhost:8000";

// Tipos exportados
export interface User {
    id: string;
    username: string;
    email: string;
    name?: string;
}

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface RegisterData {
    username: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    user: User;
    token: string;
    expires_in: number;
}

// Funciones exportadas
export async function loginWithCredentials(credentials: {
    username?: string;
    email?: string;
    password: string;
}): Promise<AuthResponse> {
    console.log("Intentando login con:", credentials);

    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
        });

        console.log("Response status:", response.status);
        console.log("Response ok:", response.ok);

        if (!response.ok) {
            const errorText = await response.text();
            console.log("Error response:", errorText);
            throw new Error("Credenciales inválidas o error del servidor");
        }

        const data = await response.json();
        console.log("Login exitoso:", data);
        
        // Map access_token to token
        if (data.access_token && !data.token) {
            data.token = data.access_token;
        }
        
        return data;
    } catch (error) {
        console.error("Error en loginWithCredentials:", error);
        throw error;
    }
}

export async function registerUser(data: RegisterData): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al registrar");
    }

    return response.json();
}

export async function logout(): Promise<void> {
    const token = localStorage.getItem("auth_token");

    // Si no hay token, ya estamos "logged out"
    if (!token) {
        console.log("No hay token - sesión ya cerrada localmente");
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/auth/logout`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        // 401 significa "token expirado/no válido" - eso ES un logout exitoso
        if (response.status === 401) {
            console.log("Token expirado/inválido - logout implícito");
            return;
        }

        if (!response.ok && response.status !== 401) {
            // Solo lanza error para otros códigos (500, 404, etc.)
            const errorText = await response.text();
            throw new Error(`Error ${response.status}: ${errorText}`);
        }

        // Si llegamos aquí, logout exitoso en el servidor
        console.log("Logout exitoso en el servidor");
    } catch (error) {
        console.warn("Advertencia durante logout:", error);
        // NO lances el error - el logout local siempre debe continuar
    }
}

export async function getSession(): Promise<User | null> {
    try {
        const token = localStorage.getItem("auth_token");

        if (!token) return null;

        const response = await fetch(`${API_BASE_URL}/auth/session`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            localStorage.removeItem("auth_token");
            return null;
        }

        return response.json();
    } catch {
        return null;
    }
}

// Funciones para login social (opcional - temporal)

export interface OAuthLoginData {
    email: string;
    username: string;
    provider: "google" | "microsoft" | "facebook";
    provider_id: string;
}

export async function loginWithOAuthBackend(
    data: OAuthLoginData
): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/oauth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Error en login OAuth");
    }

    return response.json();
}

export async function loginWithSocialCode(
    provider: string,
    code: string,
    redirect_uri: string
): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/social/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider, code, redirect_uri }),
    });

    if (!response.ok) {
        let errorText = "Error desconocido del servidor";
        try {
            const errorJson = await response.json();
            errorText = errorJson.detail || JSON.stringify(errorJson);
        } catch {
             errorText = await response.text();
        }
        console.error("Error en loginWithSocialCode:", errorText);
        throw new Error(errorText || "Error en login code");
    }

    const data = await response.json();

    // Map access_token to token
    if (data.access_token && !data.token) {
        data.token = data.access_token;
    }

    return data;
}
