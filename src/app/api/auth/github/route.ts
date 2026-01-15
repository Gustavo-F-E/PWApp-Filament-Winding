// src/app/api/auth/github/route.ts
import { NextResponse } from "next/server";

export async function GET() {
    // Redirigir al endpoint de login de GitHub en el backend
    // Usamos la URL de producción o local según corresponda, o simplemente dejamos que el frontend maneje la redirección inicial si es más simple.
    // Sin embargo, para consistencia con Google/Microsoft:
    const BACKEND_URL = process.env.NEXT_PUBLIC_URL_BACKEND || "http://localhost:8000";
    return NextResponse.redirect(`${BACKEND_URL}/auth/github/login`);
}
