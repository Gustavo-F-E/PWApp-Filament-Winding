// app/sesion/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useIdioma } from "@/context/IdiomaContext";
import { useMobile } from "@/context/MobileContext";
import { GithubIcon, GoogleIcon, MicrosoftIcon, EyeIcon, EyeOffIcon } from '../components/IconosSVG'
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

      
    const handleSocialLogin = async (
        provider: "google" | "github" | "microsoft"
    ) => {
        setIsLoading(true);
        setError("");

        const redirectUri = `${window.location.origin}/auth/callback/${provider}`;
        
        let url = "";

        // Logs de depuración (seguros)
        console.log(`[OAuth Debug] Iniciando login con ${provider}`);
        console.log(`[OAuth Debug] redirectUri: ${redirectUri}`);

        if (provider === "google") {
            const clientId = "YOUR_GOOGLE_CLIENT_ID"; // TODO: Load from env or config if exposed
            // Lo ideal es que el cliente tenga su ID público, o mejor aún, hacer un endpoint backend que devuelva la URL
            // Pero para MVP rápido, hardcode o env vars públicas.
            // MEJOR OPCIÓN: Redirigir a un endpoint de tu backend que construye la URL segura, 
            // O construirla aquí si tienes el Client ID público (NEXT_PUBLIC_...)
            // Asumiremos que el usuario pondrá los IDs en .env.local como NEXT_PUBLIC_...
            const googleId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
             if (!googleId) {
                setError("Falta configuración CLIENT_ID de Google");
                setIsLoading(false);
                return;
            }
            
            const params = new URLSearchParams({
                client_id: googleId,
                redirect_uri: redirectUri,
                response_type: "code",
                scope: "openid email profile",
                access_type: "offline",
                prompt: "consent",
            });
            url = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
        } else if (provider === "github") {
             const githubId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
             const githubRedirectUri = process.env.NEXT_PUBLIC_GITHUB_REDIRECT_URI || redirectUri;
             if (!githubId) {
                setError("Falta configuración CLIENT_ID de GitHub");
                setIsLoading(false);
                return;
            }
            
            const params = new URLSearchParams({
                client_id: githubId,
                redirect_uri: githubRedirectUri,
                scope: "user:email",
            });
             url = `https://github.com/login/oauth/authorize?${params.toString()}`;

        } else if (provider === "microsoft") {
             const msId = process.env.NEXT_PUBLIC_MICROSOFT_CLIENT_ID;
             if (!msId) {
                setError("Falta configuración CLIENT_ID de Microsoft");
                setIsLoading(false);
                return;
            }
            
            const params = new URLSearchParams({
                client_id: msId,
                redirect_uri: redirectUri,
                response_type: "code",
                scope: "openid email profile User.Read",
                response_mode: "query"
            });
            url = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?${params.toString()}`;
        }

        if (url) {
            console.log(`[OAuth Debug] Iniciando login con ${provider}`);
            console.log(`[OAuth Debug] redirectUri calculada: ${redirectUri}`);
            console.log(`[OAuth Debug] URL de autorización final: ${url}`);
            window.location.href = url;
        }
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
                                                    <EyeOffIcon className="w-5 h-5" />
                                                ) : (
                                                    <EyeIcon className="w-5 h-5" />
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
                                            <GoogleIcon className="w-6 h-6" />
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
                                            <MicrosoftIcon className="w-6 h-6" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleSocialLogin("github")
                                            }
                                            disabled={isLoading}
                                            className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50"
                                            aria-label="Iniciar sesión con GitHub"
                                        >
                                            <GithubIcon className="w-6 h-6" colorClass="#181717" />
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
