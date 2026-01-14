//src\app\oauth-success\page.tsx

"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getSession } from "@/lib/auth";

export default function OAuthSuccessPage() {
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
                    // El token no es válido o no corresponde a un usuario
                    router.replace("/sesion?error=session_failed");
                    return;
                }

                loginWithOAuth(user, token); // ahora TS sabe que user es User
                router.replace("/");
            })
            .catch(() => {
                router.replace("/sesion?error=session_failed");
            });
    }, []);
    return (
        <div className="w-full h-full flex items-center justify-center">
            <p>Iniciando sesión con Google…</p>
        </div>
    );
}
