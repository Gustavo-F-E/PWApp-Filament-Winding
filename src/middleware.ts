//\src\middleware.ts

import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    const token = request.cookies.get("auth_token")?.value;

    const protectedRoutes = [
        "/acercaDe",
        "/ayuda",
        "/capas",
        "/contacto",
        "/idioma",
        "/proyecto",

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

    // Si está logueado e intenta volver a /sesion → lo mandamos al dashboard
    if ((pathname === "/sesion" || pathname === "/registro") && token) {
        const homeUrl = new URL("/", request.url);
        return NextResponse.redirect(homeUrl);
    }

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
