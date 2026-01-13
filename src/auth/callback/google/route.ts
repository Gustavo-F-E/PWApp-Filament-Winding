// src/auth/callback/google/route.ts
import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
    process.env.NEXT_PUBLIC_API_URL || "https://fast-api-filpath.vercel.app";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const code = searchParams.get("code");
        const state = searchParams.get("state");

        if (!code) {
            return NextResponse.redirect(
                new URL("/sesion?error=missing_code", request.url)
            );
        }

        // Mandamos el code DIRECTO al backend
        const response = await fetch(`${BACKEND_URL}/auth/google/callback`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ code, state }),
        });

        const data = await response.json();

        if (!response.ok || !data.token || !data.user) {
            console.error("Backend OAuth error:", data);
            return NextResponse.redirect(
                new URL("/sesion?error=auth_failed", request.url)
            );
        }

        // Guardamos token en cookie
        const redirect = NextResponse.redirect(new URL("/", request.url));
        redirect.cookies.set("auth_token", data.token, {
            httpOnly: false, // vos lo estás usando en frontend
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7, // 7 días
        });

        return redirect;
    } catch (error) {
        console.error("Google OAuth callback error:", error);
        return NextResponse.redirect(
            new URL("/sesion?error=server_error", request.url)
        );
    }
}
