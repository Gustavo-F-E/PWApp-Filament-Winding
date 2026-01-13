// src/app/api/auth/microsoft/route.ts
import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.redirect(
        "https://fast-api-filpath.vercel.app/auth/microsoft/login"
    );
}
