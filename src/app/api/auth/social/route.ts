// src/app/api/auth/social/route.ts
import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
    process.env.BACKEND_URL || "https://fast-api-filpath.vercel.app";

export async function POST(request: NextRequest) {
    try {
        const { provider } = await request.json();

        if (!provider) {
            return NextResponse.json(
                { error: "Provider no especificado" },
                { status: 400 }
            );
        }

        const response = await fetch(`${BACKEND_URL}/auth/${provider}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(
                { error: data?.detail || "Error iniciando OAuth" },
                { status: response.status }
            );
        }

        // FastAPI debería responder algo como:
        // { url: "https://accounts.google.com/..." }
        if (!data.url) {
            return NextResponse.json(
                { error: "El backend no devolvió la URL de redirección" },
                { status: 500 }
            );
        }

        return NextResponse.json({ url: data.url });
    } catch (error) {
        console.error("Error en /api/auth/social:", error);

        return NextResponse.json(
            {
                error: `Internal server error: ${
                    error instanceof Error ? error.message : "Unknown error"
                }`,
            },
            { status: 500 }
        );
    }
}
