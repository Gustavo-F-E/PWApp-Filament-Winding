// app/sesion/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useIdioma } from "@/context/IdiomaContext";
import { GithubIcon, GoogleIcon, MicrosoftIcon, EyeIcon, EyeOffIcon } from '../components/IconosSVG'
import MenuVacio from "../components/MenuVacio";

import SesionLogic from "./SesionLogic";

export default function Sesion() {
  const { t } = useIdioma();
  const router = useRouter();

  return (
    <SesionLogic>
      {({
        loginInput,
        setLoginInput,
        password,
        setPassword,
        showPassword,
        setShowPassword,
        isLoading,
        error,
        handleSubmit,
        handleSocialLogin,
      }) => (
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
                    <h2 className="text-2xl font-bold text-white-900 mb-4">
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
                          className="block text-sm font-medium text-white-700 mb-2"
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
                          className="w-full px-4 py-2.5 border border-white-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-white-700"
                          placeholder="Nombre de usuario o dirección de email"
                          disabled={isLoading}
                          autoFocus
                        />
                      </div>

                      {/* Contraseña */}
                      <div>
                        <label
                          htmlFor="password"
                          className="block text-sm font-medium text-white-700 mb-2"
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
                            className="w-full px-4 py-2.5 border border-white-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all pr-12 text-white-700"
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
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white-500 hover:text-white-700 p-1"
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
                                ${isLoading
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
                        <div className="flex-grow border-t border-white-300"></div>
                        <span className="mx-4 text-sm text-white-500">
                          O ingresa con
                        </span>
                        <div className="flex-grow border-t border-white-300"></div>
                      </div>

                      {/* Redes */}
                      <div className="flex justify-center space-x-4">
                        <button
                          type="button"
                          onClick={() =>
                            handleSocialLogin("google")
                          }
                          disabled={isLoading}
                          className="w-12 h-12 rounded-full border border-white-300 flex items-center justify-center hover:bg-white-50 transition-colors disabled:opacity-50"
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
                          className="w-12 h-12 rounded-full border border-white-300 flex items-center justify-center hover:bg-white-50 transition-colors disabled:opacity-50"
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
                          className="w-12 h-12 rounded-full border border-white-300 flex items-center justify-center hover:bg-white-50 transition-colors disabled:opacity-50"
                          aria-label="Iniciar sesión con GitHub"
                        >
                          <GithubIcon className="w-6 h-6" colorClass="#181717" />
                        </button>
                      </div>

                      {/* Registro */}
                      <div className="text-center text-sm text-white-600">
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
                  <div className="border-t border-white-200 p-4 bg-white-50 rounded-b-xl">
                    <div className="text-center text-xs text-white-500">
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
      )}
    </SesionLogic>
  );
}
