// src/app/api/auth/callback/github/route.ts
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    // Construir la URL de redirección a la página de callback del frontend
    // Pasamos el código o el error como parámetros de búsqueda
    const baseUrl = new URL(request.url).origin;
    const redirectUrl = new URL(`${baseUrl}/auth/callback/github`);

    if (code) {
        redirectUrl.searchParams.set("code", code);
    }
    if (error) {
        redirectUrl.searchParams.set("error", error);
    }

    return NextResponse.redirect(redirectUrl.toString());
}
