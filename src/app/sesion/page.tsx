// app/sesion/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useIdioma } from "@/context/IdiomaContext";
import { useMobile } from "@/context/MobileContext";
import MenuVacio from "../components/MenuVacio";

export default function Sesion() {
    const { t } = useIdioma();
    const { login, loginWithOAuth } = useAuth();
    const router = useRouter();
    const { setPageMenuContent } = useMobile();

    const [loginInput, setLoginInput] = useState(""); // Puede ser username o email
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const oauth = params.get("oauth");
        setPageMenuContent(<MenuVacio />);

        if (oauth) {
            try {
                const data = JSON.parse(atob(oauth));
                /*
              data debe ser:
              {
                user: {...},
                token: "jwt..."
              }
            */
                loginWithOAuth(data.user, data.access_token);
                router.push("/"); // limpieza de la URL + redirección
            } catch (e) {
                console.error("Error procesando OAuth:", e);
                setError("Error al iniciar sesión con proveedor externo");
            }
        }
    }, [loginWithOAuth, router, setPageMenuContent]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!loginInput || !password) {
            setError("Por favor, completa todos los campos.");
            return;
        }

        setIsLoading(true);
        try {
            // Determinar si es email o username
            const isEmail = /\S+@\S+\.\S+/.test(loginInput);

            // Usar directamente tu función login del contexto
            if (isEmail) {
                await login({ email: loginInput, password });
            } else {
                await login({ username: loginInput, password });
            }

            // Si no hay error, redirigir
            router.push("/");
        } catch (error: unknown) {
            setError(
                error instanceof Error ? error.message : "Error al iniciar sesión"
            );
        } finally {
            setIsLoading(false);
        }
    };

      
    const handleSocialLogin = (
        provider: "google" | "facebook" | "microsoft"
    ) => {
        setIsLoading(true);
        setError("");

        // Redirigís al endpoint que inicia OAuth
      //window.location.href = `/api/auth/${provider}`;
      window.location.href = `/auth/${provider}/login`;
    };
  
    return (
        <section className="h-full w-full flex flex-col lg:grid lg:grid-rows-[repeat(23,1fr)] lg:grid-cols-[repeat(18,1fr)]">
            {/* Header interno */}
            <header className="hidden lg:block lg:row-[1/7] lg:col-[1/19] bg-blue-300">
                <MenuVacio />
            </header>

            {/* Main */}
            <main
                className="
          w-full
          lg:row-[7/24] lg:col-[1/13]
          bg-blue-50
          lg:grid lg:grid-cols-[repeat(12,1fr)]
          min-h-0 overflow-hidden
          h-full
        "
            >
                {/* Contenedor para centrar y dar padding vertical en desktop */}
                <div className="lg:col-[1/13] flex flex-col min-h-0 items-center py-10 h-full lg:py-6">
                    <article className="w-full max-w-md h-full">
                        {/* CARD */}
                        <div
                            className="bg-white rounded-xl shadow-2xl flex flex-col h-full"
                            style={{ background: "white" }}
                        >
                            {/* ZONA SCROLLEABLE */}
                            <div
                                className="flex-1 overflow-y-auto p-6"
                                style={{ background: "white" }}
                            >
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                    {t("sesion.iniciar")}
                                </h2>

                                {error && (
                                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                                        {error}
                                    </div>
                                )}

                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-4"
                                >
                                    {/* Usuario */}
                                    {/* Input combinado */}
                                    <div>
                                        <label
                                            htmlFor="loginInput"
                                            className="block text-sm font-medium text-gray-700 mb-2"
                                        >
                                            Usuario o E-Mail
                                        </label>
                                        <input
                                            id="loginInput"
                                            type="text"
                                            value={loginInput}
                                            onChange={(e) =>
                                                setLoginInput(e.target.value)
                                            }
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-700"
                                            placeholder="Nombre de usuario o dirección de email"
                                            disabled={isLoading}
                                            autoFocus
                                        />
                                    </div>

                                    {/* Contraseña */}
                                    <div>
                                        <label
                                            htmlFor="password"
                                            className="block text-sm font-medium text-gray-700 mb-2"
                                        >
                                            Contraseña
                                        </label>
                                        <div className="relative">
                                            <input
                                                id="password"
                                                type={
                                                    showPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                value={password}
                                                onChange={(e) =>
                                                    setPassword(e.target.value)
                                                }
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all pr-12 text-gray-700"
                                                placeholder="Ingresa tu contraseña"
                                                disabled={isLoading}
                                            />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowPassword(
                                                        !showPassword
                                                    )
                                                }
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 p-1"
                                                disabled={isLoading}
                                                aria-label={
                                                    showPassword
                                                        ? "Ocultar contraseña"
                                                        : "Mostrar contraseña"
                                                }
                                            >
                                                {showPassword ? (
                                                    <svg
                                                        className="w-5 h-5"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                                                        />
                                                    </svg>
                                                ) : (
                                                    <svg
                                                        className="w-5 h-5"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                        />
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                        />
                                                    </svg>
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Botón submit */}
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className={`
                      w-full py-3 px-4 rounded-lg font-semibold text-white
                      transition-all duration-200
                      ${
                          isLoading
                              ? "bg-blue-400 cursor-not-allowed"
                              : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
                      }
                    `}
                                    >
                                        {isLoading
                                            ? "Iniciando sesión…"
                                            : t("sesion.iniciar")}
                                    </button>

                                    {/* Separador */}
                                    <div className="my-4 flex items-center">
                                        <div className="flex-grow border-t border-gray-300"></div>
                                        <span className="mx-4 text-sm text-gray-500">
                                            O ingresa con
                                        </span>
                                        <div className="flex-grow border-t border-gray-300"></div>
                                    </div>

                                    {/* Redes */}
                                    <div className="flex justify-center space-x-4">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleSocialLogin("google")
                                            }
                                            disabled={isLoading}
                                            className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50"
                                            aria-label="Iniciar sesión con Google"
                                        >
                                            <svg
                                                className="w-6 h-6"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    fill="#4285F4"
                                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                                />
                                                <path
                                                    fill="#34A853"
                                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                                />
                                                <path
                                                    fill="#FBBC05"
                                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                                />
                                                <path
                                                    fill="#EA4335"
                                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                                />
                                            </svg>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleSocialLogin("microsoft")
                                            }
                                            disabled={isLoading}
                                            className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50"
                                            aria-label="Iniciar sesión con Microsoft"
                                        >
                                            <svg
                                                className="w-6 h-6"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    fill="#f25022"
                                                    d="M1 1h10v10H1z"
                                                />
                                                <path
                                                    fill="#00a4ef"
                                                    d="M13 1h10v10H13z"
                                                />
                                                <path
                                                    fill="#7fba00"
                                                    d="M1 13h10v10H1z"
                                                />
                                                <path
                                                    fill="#ffb900"
                                                    d="M13 13h10v10H13z"
                                                />
                                            </svg>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleSocialLogin("facebook")
                                            }
                                            disabled={isLoading}
                                            className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50"
                                            aria-label="Iniciar sesión con Facebook"
                                        >
                                            <svg
                                                className="w-6 h-6"
                                                fill="#1877F2"
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                            </svg>
                                        </button>
                                    </div>

                                    {/* Registro */}
                                    <div className="text-center text-sm text-gray-600">
                                        <span>{t("sesion.pregunta")} </span>
                                        <button
                                            type="button"
                                            className="text-blue-600 hover:text-blue-800 underline font-medium"
                                            onClick={() =>
                                                router.push("/registro")
                                            }
                                        >
                                            {t("sesion.registro")}
                                        </button>
                                    </div>
                                </form>
                            </div>

                            {/* FOOTER FIJO */}
                            {/* Opcional: Enlace para recuperar contraseña */}
                            <div className="text-center mt-2 mb-4 bg-white">
                                <button
                                    type="button"
                                    className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                                    onClick={() =>
                                        router.push("/recuperar-contrasena")
                                    }
                                >
                                    ¿Olvidaste tu contraseña?
                                </button>
                            </div>
                            <div className="border-t border-gray-200 p-4 bg-gray-50 rounded-b-xl">
                                <div className="text-center text-xs text-gray-500">
                                    Demo: Cualquier credencial funcionará. La
                                    autenticación real se implementará más
                                    adelante.
                                </div>
                            </div>
                        </div>
                    </article>
                </div>
            </main>

            {/* Aside derecho */}
            <aside className="hidden lg:block lg:row-[7/24] lg:col-[13/19] bg-blue-100" />
        </section>
    );
}
