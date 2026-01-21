"use client";

import { useEffect, useRef } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { loginWithSocialCode } from "@/lib/auth";

export default function CallbackLogic() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    const { loginWithOAuth } = useAuth();
    const processedRef = useRef(false);

    useEffect(() => {
        const code = searchParams.get("code");
        const provider = params.provider as string;

        if (!provider || !code || processedRef.current) return;

        // Evitar procesar el mismo código dos veces (común en React Strict Mode)
        if (!globalThis.processedCodes) globalThis.processedCodes = new Set();
        if (globalThis.processedCodes.has(code)) {
            console.log("[Callback] Código ya procesado, omitiendo...");
            return;
        }
        
        globalThis.processedCodes.add(code);
        processedRef.current = true;

        async function handleCallback() {
            try {
                let redirectUri = `${window.location.origin}/auth/callback/${provider}`;
                
                // GitHub requiere coincidencia exacta con lo registrado
                if (provider === "github" && process.env.NEXT_PUBLIC_GITHUB_REDIRECT_URI) {
                    redirectUri = process.env.NEXT_PUBLIC_GITHUB_REDIRECT_URI;
                }

                console.log("[Callback] Enviando al backend:", { provider, redirectUri });
                
                const data = await loginWithSocialCode(provider, code as string, redirectUri);
                if (data.token && data.user) {
                    await loginWithOAuth(data.user, data.token);
                    router.push("/");
                }
            } catch (err) {
                console.error("[Callback] Error en autenticación:", err);
                // Si falla, permitimos reintentar si el código cambia o la página se refresca
                if (code) globalThis.processedCodes?.delete(code);
                processedRef.current = false;
            }
        }
        handleCallback();
    }, [params, searchParams, loginWithOAuth, router]);

    return null; // Este componente solo maneja lógica y efectos
}
