//src\app\auth\callback\[provider]\page.tsx


"use client";

import { useEffect, useRef } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { loginWithSocialCode } from "@/lib/auth";
import MenuVacio from "@/app/components/MenuVacio";

// Protección global contra doble ejecución fuera del ciclo de vida del componente
declare global {
    var processedCodes: Set<string> | undefined;
}

export default function CallbackPage() {
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

    return (

      <section className="h-full w-full flex flex-col lg:grid lg:grid-rows-[repeat(23,1fr)] lg:grid-cols-[repeat(18,1fr)]">
                {/* menú superior interno */}
                <header className="hidden lg:block lg:row-[1/7] lg:col-[1/19] bg-blue-300">
                    {/* Aquí va el contenido del header */}
                    <MenuVacio />
                </header>
      
                {/* Main */}
                <main className="flex-1 w-full lg:row-[7/24] lg:col-[1/13] bg-blue-50 lg:grid lg:grid-rows-[repeat(17,1fr)] lg:grid-cols-[repeat(12,1fr)] lg:h-full">
                            <div className="lg:row-[1/18] lg:col-[1/13] flex items-center justify-center bg-gray-50 h-full">
                              <div className="text-center bg-white p-8 rounded-xl shadow-lg">
                                  <p className="text-xl font-semibold text-gray-800">Autenticando...</p>
                                  <p className="text-gray-500 mt-2 text-sm">Por favor, espera un momento.</p>
                                  <div className="mt-6 animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
                              </div>
                        </div>
                </main>
      
                {/* Aside */}
                <aside className="hidden lg:block lg:row-[7/24] lg:col-[13/19] bg-blue-100"></aside>
            </section>
    );
}
