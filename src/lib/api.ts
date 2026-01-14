//src\lib\api.ts

//const API_BASE_URL = "https://fast-api-filpath.vercel.app";
const API_BASE_URL = process.env.NEXT_PUBLIC_URL_BACKEND || "http://localhost:8000";

export async function apiFetch<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const token = localStorage.getItem("auth_token");

    const headers = {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
        credentials: "include",
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(
            error.message || `HTTP error! status: ${response.status}`
        );
    }

    return response.json();
}

// Métodos específicos
export const api = {
    get: <T>(endpoint: string) => apiFetch<T>(endpoint, { method: "GET" }),
    post: <T>(endpoint: string, data?: unknown) =>
        apiFetch<T>(endpoint, { method: "POST", body: JSON.stringify(data) }),
    put: <T>(endpoint: string, data?: unknown) =>
        apiFetch<T>(endpoint, { method: "PUT", body: JSON.stringify(data) }),
    delete: <T>(endpoint: string) =>
        apiFetch<T>(endpoint, { method: "DELETE" }),
};
