export interface User {
    id: string;
    username: string;
    email: string;
    name?: string;
    avatar?: string;
    created_at: string;
}

export interface AuthResponse {
    user: User;
    token: string;
    expires_in: number;
}

export interface SocialAuthRequest {
    provider: "google" | "microsoft" | "facebook";
    code?: string;
    state?: string;
}
