// src/app/auth/callback/[provider]/page.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { loginWithSocialCode } from "@/lib/auth";

declare global {
    var processedCodes: Set<string> | undefined;
}

export default function SocialCallbackPage() {
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();
    const { loginWithOAuth } = useAuth();

    const [status, setStatus] = useState<"loading" | "success" | "error">(
        "loading"
    );
    const [errorMessage, setErrorMessage] = useState("");

    // Usar useRef para el StrictMode local, pero...
    const processedRef = useRef(false);

    useEffect(() => {
        const processLogin = async () => {
             const code = searchParams.get("code");
             if (!code) return;

             // Protección global contra doble ejecución (incluso si remonta)
            if (globalThis.processedCodes?.has(code)) {
                 console.log("Code ya procesado globalmente, omitiendo:", code);
                 return;
            }
             
            if (processedRef.current) return;
            processedRef.current = true;
            
            // Marcar globalmente
             if (!globalThis.processedCodes) globalThis.processedCodes = new Set();
             globalThis.processedCodes.add(code);

            try {
                const provider = params.provider as string;
                const code = searchParams.get("code");
                const error = searchParams.get("error");

                console.log("Callback recibido:", {
                    provider,
                    code,
                    error,
                    fullUrl: window.location.href,
                });

                if (error) {
                    throw new Error(`Error del proveedor OAuth: ${error}`);
                }

                if (!provider) {
                    throw new Error("No se recibió el provider en la URL");
                }

                if (!code) {
                    throw new Error("No se recibió el code de autenticación");
                }

                // Debe coincidir EXACTAMENTE con lo configurado en Google Console y en FastAPI
                const envRedirectUri = process.env.NEXT_PUBLIC_OAUTH_REDIRECT_URI;
                const redirectUri = envRedirectUri 
                    ? (envRedirectUri.includes(provider) ? envRedirectUri : `${envRedirectUri}/${provider}`)
                    : `${window.location.origin}/auth/callback/${provider}`;

                console.log("Enviando al backend:", {
                    provider,
                    code,
                    redirectUri,
                });

                const data = await loginWithSocialCode(
                    provider,
                    code,
                    redirectUri
                );

                console.log("Respuesta del backend:", data);

                if (!data?.token || !data?.user) {
                    throw new Error("El backend no devolvió token o usuario");
                }

                // Guardar sesión en el contexto
                await loginWithOAuth(data.user, data.token);

                setStatus("success");

                setTimeout(() => {
                    router.push("/");
                }, 1000);
            } catch (err: any) {
                console.error("Error completo en callback:", err);
                setStatus("error");
                setErrorMessage(
                    err.message || "Error desconocido en autenticación"
                );
            }
        };

        processLogin();
    }, [params, searchParams, router, loginWithOAuth]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
            <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
                {status === "loading" && (
                    <>
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <h2 className="text-xl font-semibold text-gray-800">
                            Autenticando...
                        </h2>
                        <p className="text-gray-500 mt-2">
                            Procesando credenciales OAuth.
                        </p>
                    </>
                )}

                {status === "success" && (
                    <>
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg
                                className="w-6 h-6 text-green-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-800">
                            Login exitoso
                        </h2>
                        <p className="text-gray-500 mt-2">Redirigiendo...</p>
                    </>
                )}

                {status === "error" && (
                    <>
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg
                                className="w-6 h-6 text-red-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-800">
                            Error de autenticación
                        </h2>
                        <p className="text-red-500 mt-2 text-sm">
                            {errorMessage}
                        </p>
                        <button
                            onClick={() => router.push("/")}
                            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Volver al inicio
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
