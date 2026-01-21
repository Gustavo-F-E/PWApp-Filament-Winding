//\src\middleware.ts

import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    const token = request.cookies.get("auth_token")?.value;

    const protectedRoutes = [

        "/app", // si tenés secciones privadas
    ];

    const { pathname } = request.nextUrl;

    const isProtected = protectedRoutes.some((route) =>
        pathname.startsWith(route)
    );

    // Si intenta entrar a una ruta protegida sin token → login
    if (isProtected && !token) {
        const loginUrl = new URL("/sesion", request.url);
        return NextResponse.redirect(loginUrl);
    }

    // Si está en /sesion o /registro y tiene token, dejamos pasar si no hay un usuario validado en cliente
    // Pero para evitar bucles, el middleware solo debe actuar en rutas protegidas mayormente.
    // Eliminamos la redirección automática del middleware para /sesion y /registro 
    // y dejamos que la lógica de cliente decida si ya está logueado.

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Ejecuta el middleware solo en páginas, no en:
         * - api
         * - archivos estáticos
         */
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};
