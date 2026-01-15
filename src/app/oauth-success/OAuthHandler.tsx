//src\app\oauth-success\OAuthHandler.tsx

"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getSession } from "@/lib/auth";

export default function OAuthHandler() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { loginWithOAuth } = useAuth();

    useEffect(() => {
        const token = searchParams.get("token");
        if (!token) {
            router.replace("/sesion?error=missing_token");
            return;
        }

        getSession()
            .then((user) => {
                if (!user) {
                    router.replace("/sesion?error=session_failed");
                    return;
                }

                loginWithOAuth(user, token);
                router.replace("/");
            })
            .catch(() => {
                router.replace("/sesion?error=session_failed");
            });
    }, [searchParams, router, loginWithOAuth]);

    return (
        <div className="w-full h-full flex items-center justify-center">
            <p>Iniciando sesión con Google…</p>
        </div>
    );
}
