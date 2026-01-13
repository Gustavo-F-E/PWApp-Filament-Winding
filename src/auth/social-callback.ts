import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
    process.env.NEXT_PUBLIC_API_URL || "https://fast-api-filpath.vercel.app";

export async function handleSocialCallback(
    request: NextRequest,
    provider: string
) {
    try {
        const { searchParams } = new URL(request.url);
        const code = searchParams.get("code");
        const state = searchParams.get("state");

        if (!code) {
            return NextResponse.redirect(
                new URL("/sesion?error=missing_code", request.url)
            );
        }

        // Mandamos el code DIRECTO al backend nuevo
        const response = await fetch(`${BACKEND_URL}/auth/social/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ 
                provider, 
                code, 
                redirect_uri: `${new URL(request.url).origin}/auth/callback/${provider}`
            }),
        });

        const data = await response.json();

        if (!response.ok || !data.access_token || !data.user) {
            console.error("Backend OAuth error:", data);
            return NextResponse.redirect(
                new URL("/sesion?error=auth_failed", request.url)
            );
        }

        // Guardamos token en cookie
        const redirect = NextResponse.redirect(new URL("/", request.url));
        redirect.cookies.set("auth_token", data.access_token, {
            httpOnly: false, // Frontend readable as requested before
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7, // 7 días
        });

        return redirect;
    } catch (error) {
        console.error(`${provider} OAuth callback error:`, error);
        return NextResponse.redirect(
            new URL("/sesion?error=server_error", request.url)
        );
    }
}
