import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const response = await fetch(
            "https://fast-api-filpath.vercel.app/auth/logout",
            {
                method: "POST",
                headers: {
                    Authorization: request.headers.get("Authorization") || "",
                },
            }
        );

        return NextResponse.json(
            { success: true },
            { status: response.status }
        );
    }  catch (error) {
    return NextResponse.json(
        { error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
        { status: 500 }
    );
}
}