"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useMobile } from "@/context/MobileContext";
import { useIdioma } from "@/context/IdiomaContext";
import MenuVacio from "../components/MenuVacio";

interface SesionLogicProps {
    children: (props: {
        loginInput: string;
        setLoginInput: (val: string) => void;
        password: string;
        setPassword: (val: string) => void;
        showPassword: boolean;
        setShowPassword: (val: boolean) => void;
        isLoading: boolean;
        error: string;
        handleSubmit: (e: React.FormEvent) => Promise<void>;
        handleSocialLogin: (provider: "google" | "github" | "microsoft") => Promise<void>;
    }) => React.ReactNode;
}

export default function SesionLogic({ children }: SesionLogicProps) {
    const { login, loginWithOAuth } = useAuth();
    const router = useRouter();
    const { setPageMenuContent } = useMobile();
    const { t } = useIdioma(); // Added useIdioma hook

    const [loginInput, setLoginInput] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const contentSet = useRef(false); // Declared contentSet with useRef

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const oauth = params.get("oauth");
        
        if (!contentSet.current) {
            setPageMenuContent(<MenuVacio />);
            contentSet.current = true;
        }

        if (oauth) {
            try {
                const data = JSON.parse(atob(oauth));
                loginWithOAuth(data.user, data.access_token);
                router.push("/");
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
            const isEmail = /\S+@\S+\.\S+/.test(loginInput);
            if (isEmail) {
                await login({ email: loginInput, password });
            } else {
                await login({ username: loginInput, password });
            }
            router.push("/");
        } catch (error: any) {
            setError(error instanceof Error ? error.message : "Error al iniciar sesión");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSocialLogin = async (provider: "google" | "github" | "microsoft") => {
        setIsLoading(true);
        setError("");

        const redirectUri = `${window.location.origin}/auth/callback/${provider}`;
        let url = "";

        if (provider === "google") {
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
            window.location.href = url;
        }
    };

    return (
        <>
            {children({
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
            })}
        </>
    );
}
