import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { provider } = await request.json();

        const response = await fetch(
            `https://fast-api-filpath.vercel.app/auth/${provider}/login`,
            {
                method: "POST",
            }
        );

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
