import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const response = await fetch(
            "https://fast-api-filpath.vercel.app/auth/session",
            {
                headers: {
                    Authorization: request.headers.get("Authorization") || "",
                },
            }
        );

        if (!response.ok) {
            return NextResponse.json(null, { status: 401 });
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
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