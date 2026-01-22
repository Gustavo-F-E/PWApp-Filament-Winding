"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useMobile } from "@/context/MobileContext";
import MenuCapas from "./MenuCapas";
import { useRouter } from "next/navigation";

export interface Project {
    id: string;
    name: string;
    description: string;
    user_email: string;
    liner_name: string | null;
    machine_name: string | null;
    layers: string[];
    completion_percentage: number;
    created_at: string;
    updated_at: string;
}

export interface Liner {
    id: string;
    name: string;
    tipo_liner: string;
    user_email: string;
}

export interface Machine {
    id: string;
    name: string;
    tipo: string;
    user_email: string;
}

interface ProyectoContextType {
    projects: Project[];
    liners: Liner[];
    machines: Machine[];
    loading: boolean;
    error: string | null;
    showForm: boolean;
    setShowForm: (val: boolean) => void;
    editingProject: Project | null;
    setEditingProject: (val: Project | null) => void;
    isSubmitting: boolean;
    isAsideOpen: boolean;
    isAsideVisible: boolean;
    selectedProject: Project | null;
    setSelectedProject: (val: Project | null) => void;
    toggleAside: () => void;
    handleFormSubmit: (formData: any) => void;
    handleEditClick: (project: Project) => void;
    handleDeleteProject: (id: string) => void;
    handleCancelForm: () => void;
    fetchProjects: () => void;
    fetchLiners: () => void;
    fetchMachines: () => void;
}

const ProyectoContext = createContext<ProyectoContextType | undefined>(undefined);

export function ProyectoProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { setPageMenuContent, setLandscapeSidebarOpen } = useMobile();
    const [isAsideOpen, setIsAsideOpen] = useState(false);
    const [isAsideVisible, setIsAsideVisible] = useState(false);

    const [projects, setProjects] = useState<Project[]>([]);
    const [liners, setLiners] = useState<Liner[]>([]);
    const [machines, setMachines] = useState<Machine[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const API_BASE_URL = process.env.NEXT_PUBLIC_URL_BACKEND || "http://localhost:8000";

    const fetchProjects = useCallback(async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("auth_token");
            if (!token) {
                setProjects([]);
                setLoading(false);
                return;
            }

            const headers: HeadersInit = {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            };

            const response = await fetch(`${API_BASE_URL}/projects/`, {
                headers,
            });

            if (!response.ok) throw new Error("Error al cargar proyectos");

            const data = await response.json();
            setProjects(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error desconocido");
        } finally {
            setLoading(false);
        }
    }, [API_BASE_URL]);

    const fetchLiners = useCallback(async () => {
        try {
            const token = localStorage.getItem("auth_token");
            if (!token) return;
            const response = await fetch(`${API_BASE_URL}/liners/`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (response.ok) setLiners(await response.json());
        } catch (err) { console.error("Error fetching liners:", err); }
    }, [API_BASE_URL]);

    const fetchMachines = useCallback(async () => {
        try {
            const token = localStorage.getItem("auth_token");
            if (!token) return;
            const response = await fetch(`${API_BASE_URL}/machines/`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (response.ok) setMachines(await response.json());
        } catch (err) { console.error("Error fetching machines:", err); }
    }, [API_BASE_URL]);

    useEffect(() => {
        fetchProjects();
        fetchLiners();
        fetchMachines();
    }, [fetchProjects, fetchLiners, fetchMachines]);

    // Auto-seleccionar el proyecto más recientemente modificado
    useEffect(() => {
        if (projects.length > 0 && !selectedProject) {
            const latest = [...projects].sort((a, b) => 
                new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
            )[0];
            setSelectedProject(latest);
        }
    }, [projects, selectedProject]);

    useEffect(() => {
        setPageMenuContent(<MenuCapas mobileMode={true} />);
        setLandscapeSidebarOpen(true);
    }, [setPageMenuContent, setLandscapeSidebarOpen]);

    const toggleAside = useCallback(() => {
        if (isAsideOpen) {
            setIsAsideOpen(false);
            setTimeout(() => setIsAsideVisible(false), 300);
        } else {
            setIsAsideVisible(true);
            requestAnimationFrame(() => {
                requestAnimationFrame(() => setIsAsideOpen(true));
            });
        }
    }, [isAsideOpen]);

    const handleCreateProject = useCallback(async (formData: { name: string; description: string }) => {
        try {
            setIsSubmitting(true);
            const token = localStorage.getItem("auth_token");
            if (!token) throw new Error("No hay sesión activa");

            const headers: HeadersInit = {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            };

            const response = await fetch(`${API_BASE_URL}/projects/`, {
                method: "POST",
                headers,
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || "Error al crear proyecto");
            }

            const newProject = await response.json();
            setProjects((prev) => [...prev, newProject]);
            setShowForm(false);
            alert("Proyecto creado exitosamente");
            router.push("/proyecto");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error desconocido");
        } finally {
            setIsSubmitting(false);
        }
    }, [API_BASE_URL, router]);

    const handleUpdateProject = useCallback(async (formData: { name: string; description: string }) => {
        if (!editingProject) return;

        try {
            setIsSubmitting(true);
            const token = localStorage.getItem("auth_token");
            if (!token) throw new Error("No hay sesión activa");

            const headers: HeadersInit = {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            };

            const response = await fetch(`${API_BASE_URL}/projects/${editingProject.id}`, {
                method: "PUT",
                headers,
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || "Error al actualizar proyecto");
            }

            const updatedProject = await response.json();
            setProjects((prev) =>
                prev.map((p) => (p.id === editingProject.id ? updatedProject : p))
            );
            
            if (selectedProject?.id === editingProject.id) {
                setSelectedProject(updatedProject);
            }
            setEditingProject(null);
            setShowForm(false);
            alert("Proyecto actualizado exitosamente");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error desconocido");
        } finally {
            setIsSubmitting(false);
        }
    }, [API_BASE_URL, editingProject, selectedProject]);

    const handleDeleteProject = useCallback(async (id: string) => {
        if (!confirm("¿Estás seguro de eliminar este proyecto?")) return;

        try {
            const token = localStorage.getItem("auth_token");
            const headers: HeadersInit = {};

            if (token) {
                headers["Authorization"] = `Bearer ${token}`;
            }

            const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
                method: "DELETE",
                headers,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || "Error al eliminar proyecto");
            }

            setProjects((prev) => prev.filter((p) => p.id !== id));
            if (selectedProject?.id === id) {
                setSelectedProject(null);
            }
            alert("Proyecto eliminado exitosamente");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error desconocido");
        }
    }, [API_BASE_URL, selectedProject]);

    const handleFormSubmit = useCallback((formData: { name: string; description: string }) => {
        if (editingProject) {
            handleUpdateProject(formData);
        } else {
            handleCreateProject(formData);
        }
    }, [editingProject, handleUpdateProject, handleCreateProject]);

    const handleEditClick = useCallback((project: Project) => {
        setEditingProject(project);
        setShowForm(true);
    }, []);

    const handleCancelForm = useCallback(() => {
        setShowForm(false);
        setEditingProject(null);
    }, []);

    const contextValue = React.useMemo(() => ({
        projects,
        liners,
        machines,
        loading,
        error,
        showForm,
        setShowForm,
        editingProject,
        setEditingProject,
        selectedProject,
        setSelectedProject,
        isSubmitting,
        isAsideOpen,
        isAsideVisible,
        toggleAside,
        handleFormSubmit,
        handleEditClick,
        handleDeleteProject,
        handleCancelForm,
        fetchProjects,
        fetchLiners,
        fetchMachines,
    }), [
        projects, liners, machines, loading, error, showForm, editingProject, selectedProject, 
        isSubmitting, isAsideOpen, isAsideVisible, toggleAside, 
        handleFormSubmit, handleEditClick, handleDeleteProject, handleCancelForm,
        fetchProjects, fetchLiners, fetchMachines
    ]);

    return (
        <ProyectoContext.Provider value={contextValue}>
            {children}
        </ProyectoContext.Provider>
    );
}

export function useProyecto() {
    const context = useContext(ProyectoContext);
    if (context === undefined) {
        throw new Error("useProyecto must be used within a ProyectoProvider");
    }
    return context;
}
