//src\auth\callback\facebook\route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const code = searchParams.get("code");

        if (!code) {
            return NextResponse.redirect(
                new URL("/sesion?error=missing_code", request.url)
            );
        }

        // 1. Intercambiar code por access_token en Facebook
        const tokenRes = await fetch(
            "https://graph.facebook.com/v18.0/oauth/access_token?" +
                new URLSearchParams({
                    client_id: process.env.FACEBOOK_CLIENT_ID!,
                    redirect_uri: process.env.FACEBOOK_REDIRECT_URI!,
                    client_secret: process.env.FACEBOOK_CLIENT_SECRET!,
                    code,
                })
        );

        const tokenData = await tokenRes.json();

        if (!tokenRes.ok) {
            console.error("Facebook token error:", tokenData);
            return NextResponse.redirect(
                new URL("/sesion?error=token_exchange_failed", request.url)
            );
        }

        // 2. Pedir datos del usuario
        const userRes = await fetch(
            `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${tokenData.access_token}`
        );

        const facebookUser = await userRes.json();

        /*
      facebookUser:
      {
        id,
        name,
        email,
        picture: { data: { url } }
      }
    */

        // 3. Mandar usuario a tu backend FastAPI
        const backendRes = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/oauth`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: facebookUser.email,
                    username: facebookUser.name
                        .replace(/\s+/g, "")
                        .toLowerCase(),
                    provider: "facebook",
                    provider_id: facebookUser.id,
                }),
            }
        );

        const backendData = await backendRes.json();

        if (!backendRes.ok) {
            console.error("Backend auth error:", backendData);
            return NextResponse.redirect(
                new URL("/sesion?error=backend_auth_failed", request.url)
            );
        }

        // 4. Redirigir al frontend con datos serializados
        const redirectUrl = new URL("/sesion", request.url);
        redirectUrl.searchParams.set(
            "oauth",
            Buffer.from(JSON.stringify(backendData)).toString("base64")
        );

        return NextResponse.redirect(redirectUrl);
    } catch (error) {
        console.error("Facebook OAuth callback error:", error);
        return NextResponse.redirect(
            new URL("/sesion?error=server_error", request.url)
        );
    }
}
