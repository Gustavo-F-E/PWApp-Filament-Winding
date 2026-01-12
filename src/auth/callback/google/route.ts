import { NextRequest, NextResponse } from "next/server";

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

        // Enviar código a tu backend
        const response = await fetch(
            "https://fast-api-filpath.vercel.app/auth/google/callback",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code, state }),
            }
        );

        const data = await response.json();

        if (response.ok && data.token) {
            // Guardar token y redirigir
            const redirect = NextResponse.redirect(new URL("/", request.url));
            redirect.cookies.set("auth_token", data.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 60 * 60 * 24 * 7, // 7 días
            });
            return redirect;
        }

        return NextResponse.redirect(
            new URL("/sesion?error=auth_failed", request.url)
        );
    } catch (error) {
        return NextResponse.redirect(
            new URL("/sesion?error=server_error", request.url)
        );
    }
}
