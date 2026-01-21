'use client'

import { useRouter } from 'next/navigation'
import MenuVacio from '../components/MenuVacio'
import ModalPoliticas from '../components/ModalPoliticas'
import Image from "next/image";
import { GithubIcon, GoogleIcon, MicrosoftIcon, EyeIcon, EyeOffIcon } from '../components/IconosSVG'

import RegistroLogic from "./RegistroLogic";

export default function Registro() {
  const router = useRouter()

  return (
    <RegistroLogic>
        {({
            formData,
            handleInputChange,
            errors,
            isLoading,
            showPassword,
            setShowPassword,
            showConfirmPassword,
            setShowConfirmPassword,
            acceptedTerms,
            setAcceptedTerms,
            isPoliticasOpen,
            setIsPoliticasOpen,
            handleSubmit,
            handleSocialRegister,
        }) => (
            <section className="lg:h-[calc(100vh-(100vh/24))] h-full w-full flex flex-col lg:grid lg:grid-rows-[repeat(23,1fr)] lg:grid-cols-[repeat(18,1fr)] overflow-hidden">
                {/* menú superior interno */}
                <header className="hidden lg:block lg:row-[1/7] lg:col-[1/19] bg-blue-300">
                    <MenuVacio />
                </header>

                {/* CONTENIDO PRINCIPAL */}
                <main className="flex-1 w-full h-full lg:row-[7/24] lg:col-[1/13] bg-blue-50 lg:h-full overflow-hidden min-h-0">
                    <div className="h-full w-full flex justify-center p-10">
                        <div
                            className="bg-white w-full h-full max-w-md rounded-xl shadow-2xl overflow-y-auto"
                            style={{ background: "white" }}
                        >
                            {/* Header */}
                            <div className="border-b border-gray-200 p-6">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    Crear Cuenta
                                </h2>
                            </div>

                            {/* Formulario de Registro */}
                            <form onSubmit={handleSubmit} className="p-6">
                                {errors.general && (
                                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                                        {errors.general}
                                    </div>
                                )}

                                {/* Campo Nombre de Usuario */}
                                <div className="mb-4">
                                    <label
                                        htmlFor="username"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Nombre de Usuario
                                    </label>
                                    <input
                                        id="username"
                                        name="username"
                                        type="text"
                                        value={formData.username}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-700 ${
                                            errors.username
                                                ? "border-red-300"
                                                : "border-gray-300"
                                        }`}
                                        placeholder="Ingresa tu nombre de usuario"
                                        disabled={isLoading}
                                        autoFocus
                                    />
                                    {errors.username && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.username}
                                        </p>
                                    )}
                                </div>

                                {/* Campo Email */}
                                <div className="mb-4">
                                    <label
                                        htmlFor="email"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        E-Mail
                                    </label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-700 ${
                                            errors.email
                                                ? "border-red-300"
                                                : "border-gray-300"
                                        }`}
                                        placeholder="Ingresa tu email"
                                        disabled={isLoading}
                                    />
                                    {errors.email && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.email}
                                        </p>
                                    )}
                                </div>

                                {/* Campo Contraseña */}
                                <div className="mb-4">
                                    <label
                                        htmlFor="password"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Contraseña
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="password"
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all pr-12 text-gray-700 ${
                                                errors.password
                                                    ? "border-red-300"
                                                    : "border-gray-300"
                                            }`}
                                            placeholder="Crea una contraseña segura"
                                            disabled={isLoading}
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword(!showPassword)
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
                                    {errors.password && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.password}
                                        </p>
                                    )}
                                </div>

                                {/* Campo Confirmar Contraseña */}
                                <div className="mb-6">
                                    <label
                                        htmlFor="confirmPassword"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Confirmar Contraseña
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type={
                                                showConfirmPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            value={formData.confirmPassword}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all pr-12 text-gray-700 ${
                                                errors.confirmPassword
                                                    ? "border-red-300"
                                                    : "border-gray-300"
                                            }`}
                                            placeholder="Vuelve a escribir tu contraseña"
                                            disabled={isLoading}
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowConfirmPassword(
                                                    !showConfirmPassword
                                                )
                                            }
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 p-1"
                                            disabled={isLoading}
                                            aria-label={
                                                showConfirmPassword
                                                    ? "Ocultar contraseña"
                                                    : "Mostrar contraseña"
                                            }
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOffIcon className="w-5 h-5" />
                                            ) : (
                                                <EyeIcon className="w-5 h-5" />
                                            )}
                                        </button>
                                    </div>
                                    {errors.confirmPassword && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.confirmPassword}
                                        </p>
                                    )}
                                </div>
                                {/* Footer con términos y políticas */}
                                <div className="pt-10 pb-10 flex flex-row items-center justify-center gap-0 w-[80%] mx-auto">
                                    <div className="relative min-w-8 min-h-8 max-w-16 max-h-16">
                                        <Image
                                            src="/images/icons/alert.svg"
                                            alt={"Alerta"}
                                            fill={true} // Ocupa todo el contenedor
                                            className="object-contain"
                                        />
                                    </div>
                                    <div className="text-center text-xs text-gray-500">
                                        Para registrarte, debes leer y aceptar
                                        nuestros{" "}
                                        <button
                                            type="button"
                                            className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                                            onClick={() => setIsPoliticasOpen(true)}
                                        >
                                            Términos de Servicio y Política de
                                            Privacidad
                                        </button>
                                    </div>
                                </div>
                                {/* Botón de Registro */}
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (!acceptedTerms) {
                                            setIsPoliticasOpen(true);
                                            return;
                                        }
                                        // Llamar directamente al handleSubmit de la lógica
                                        const event = {
                                            preventDefault: () => {},
                                        } as React.FormEvent;
                                        handleSubmit(event);
                                    }}
                                    disabled={isLoading}
                                    className={`
                w-full py-3 px-4 rounded-lg font-semibold text-white
                transition-all duration-200 mb-6
                ${
                    isLoading
                        ? "bg-blue-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
                }
            `}
                                >
                                    {isLoading ? (
                                        <span className="flex items-center justify-center">
                                            <svg
                                                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                />
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                />
                                            </svg>
                                            Creando cuenta...
                                        </span>
                                    ) : (
                                        "Registrarse"
                                    )}
                                </button>

                                {/* Separador */}
                                <div className="mb-6">
                                    <div className="flex items-center">
                                        <div className="flex-grow border-t border-gray-300"></div>
                                        <span className="mx-4 text-sm text-gray-500">
                                            O Registrese con:
                                        </span>
                                        <div className="flex-grow border-t border-gray-300"></div>
                                    </div>
                                </div>

                                {/* Botones de Redes Sociales */}
                                <div className="flex justify-center space-x-4 mb-6">
                                    {/* Google */}
                                    <button
                                        type="button"
                                        onClick={() => handleSocialRegister("google")}
                                        disabled={isLoading}
                                        className={`
                                                w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center 
                                                transition-colors 
                                                ${
                                                    isLoading
                                                        ? "cursor-not-allowed opacity-50"
                                                        : "hover:bg-gray-50"
                                                }
                                            `}
                                        aria-label="Registrarse con Google"
                                    >
                                        <GoogleIcon className="w-6 h-6" />
                                    </button>

                                    {/* Microsoft */}
                                    <button
                                        type="button"
                                        onClick={() => handleSocialRegister("microsoft")}
                                        disabled={isLoading}
                                        className={`
                                                w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center 
                                                transition-colors 
                                                ${
                                                    isLoading
                                                        ? "cursor-not-allowed opacity-50"
                                                        : "hover:bg-gray-50"
                                                }
                                            `}
                                        aria-label="Registrarse con Microsoft"
                                    >
                                        <MicrosoftIcon className="w-6 h-6" />
                                    </button>

                                    {/* GitHub */}
                                    <button
                                        type="button"
                                        onClick={() => handleSocialRegister("github")}
                                        disabled={isLoading}
                                        className={`
                                                w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center 
                                                transition-colors 
                                                ${
                                                    isLoading
                                                        ? "cursor-not-allowed opacity-50"
                                                        : "hover:bg-gray-50"
                                                }
                                            `}
                                        aria-label="Registrarse con GitHub"
                                    >
                                        <GithubIcon className="w-6 h-6" colorClass="#181717" />
                                    </button>
                                </div>

                                {/* Enlace para iniciar sesión */}
                                <div className="text-center text-sm text-gray-600">
                                    <span>¿Ya tienes una cuenta? </span>
                                    <button
                                        type="button"
                                        onClick={() => router.push("/sesion")}
                                        className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                                    >
                                        Iniciar Sesión
                                    </button>
                                </div>
                            </form>

                            <ModalPoliticas
                                isOpen={isPoliticasOpen}
                                onClose={() => setIsPoliticasOpen(false)}
                                showAcceptButton
                                onAccept={() => {
                                    setAcceptedTerms(true);
                                    setIsPoliticasOpen(false);
                                }}
                            />
                        </div>
                    </div>
                </main>

                {/* aside derecho */}
                <aside className="hidden lg:block lg:row-[7/24] lg:col-[13/19] bg-blue-100"></aside>
            </section>
        )}
    </RegistroLogic>
  );
}
