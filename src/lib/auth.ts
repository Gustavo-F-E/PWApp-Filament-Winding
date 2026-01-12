const API_BASE_URL = "/api"; // Ahora usa las rutas de Next.js

export async function loginWithCredentials(credentials: {
    username: string;
    password: string;
}) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Credenciales inválidas");
    }

    return response.json();
}

export async function registerUser(data: {
    username: string;
    email: string;
    password: string;
}) {
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
