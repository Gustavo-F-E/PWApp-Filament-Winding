"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useMobile } from "@/context/MobileContext";
import MenuVacio from "../components/MenuVacio";

interface RegistroLogicProps {
    children: (props: {
        formData: any;
        handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
        errors: Record<string, string>;
        isLoading: boolean;
        showPassword: boolean;
        setShowPassword: (val: boolean) => void;
        showConfirmPassword: boolean;
        setShowConfirmPassword: (val: boolean) => void;
        acceptedTerms: boolean;
        setAcceptedTerms: (val: boolean) => void;
        isPoliticasOpen: boolean;
        setIsPoliticasOpen: (val: boolean) => void;
        handleSubmit: (e: React.FormEvent) => Promise<void>;
        handleSocialRegister: (provider: "google" | "github" | "microsoft") => Promise<void>;
    }) => React.ReactNode;
}

export default function RegistroLogic({ children }: RegistroLogicProps) {
    const { register } = useAuth();
    const router = useRouter();
    const { setPageMenuContent } = useMobile();
    const [isPoliticasOpen, setIsPoliticasOpen] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(false);

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const contentSet = useRef(false);

    useEffect(() => {
        if (!contentSet.current) {
            setPageMenuContent(<MenuVacio />);
            contentSet.current = true;
        }
    }, [setPageMenuContent]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (errors[name]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.username.trim()) {
            newErrors.username = "El nombre de usuario es requerido";
        } else if (formData.username.length < 3) {
            newErrors.username = "El nombre de usuario debe tener al menos 3 caracteres";
        }

        if (!formData.email.trim()) {
            newErrors.email = "El email es requerido";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "El email no es válido";
        }

        if (!formData.password) {
            newErrors.password = "La contraseña es requerida";
        } else if (formData.password.length < 6) {
            newErrors.password = "La contraseña debe tener al menos 6 caracteres";
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Por favor confirma tu contraseña";
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Las contraseñas no coinciden";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            await register({
                username: formData.username,
                email: formData.email,
                password: formData.password,
            });
            router.push("/");
        } catch (error: any) {
            setErrors({
                general: error instanceof Error ? error.message : "Error al registrar. Intenta nuevamente.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSocialRegister = async (provider: "google" | "github" | "microsoft") => {
        if (!acceptedTerms) {
            setIsPoliticasOpen(true);
            return;
        }

        setIsLoading(true);
        const redirectUri = `${window.location.origin}/auth/callback/${provider}`;
        let url = "";

        if (provider === "google") {
            const googleId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
            if (!googleId) {
                setErrors({ general: "Falta configuración CLIENT_ID de Google" });
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
                setErrors({ general: "Falta configuración CLIENT_ID de GitHub" });
                setIsLoading(false);
                return;
            }

            const params = new URLSearchParams({
                client_id: githubId,
                redirect_uri: githubRedirectUri,
                scope: "user:email",
                response_type: "code",
            });
            url = `https://github.com/login/oauth/authorize?${params.toString()}`;
        } else if (provider === "microsoft") {
            const msId = process.env.NEXT_PUBLIC_MICROSOFT_CLIENT_ID;
            if (!msId) {
                setErrors({ general: "Falta configuración CLIENT_ID de Microsoft" });
                setIsLoading(false);
                return;
            }

            const params = new URLSearchParams({
                client_id: msId,
                redirect_uri: redirectUri,
                response_type: "code",
                scope: "openid email profile User.Read",
                response_mode: "query",
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
            })}
        </>
    );
}
