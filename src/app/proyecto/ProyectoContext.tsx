// src\app\proyecto\ProyectoContext.tsx

"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useMobile } from "@/context/MobileContext";
import { useAuth } from "@/context/AuthContext";
import MenuProyecto from "./MenuProyecto";
import { useRouter } from "next/navigation";

export interface Project {
  id: string;
  name: string;
  description: string;
  user_email: string;
  liner_name: string | null;
  machine_name: string | null;
  layers: any[];
  completion_percentage: number;
  created_at: string;
  updated_at: string;
}

export interface Liner {
  id: string;
  name: string;
  tipo_liner: string;
  user_email: string;
  extremo_inicial?: { tipo: string;[key: string]: any };
  medio?: { tipo: string;[key: string]: any };
  extremo_final?: { tipo: string;[key: string]: any };
  created_at?: string;
  updated_at?: string;
}

export interface Machine {
  id: string;
  name: string;
  tipo: string;
  user_email: string;
  velocidad_maquina?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Material {
  id: string;
  name: string;
  description: string | null;
  espesor: number;
  ancho: number;
  coeficiente_rozamiento: number;
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
  editingLiner: Liner | null;
  setEditingLiner: (val: Liner | null) => void;
  editingMachine: Machine | null;
  setEditingMachine: (val: Machine | null) => void;
  isSubmitting: boolean;
  isAsideOpen: boolean;
  isAsideVisible: boolean;
  selectedProject: Project | null;
  setSelectedProject: (val: Project | null) => void;
  selectedLiner: Liner | null;
  setSelectedLiner: (val: Liner | null) => void;
  selectedMachine: Machine | null;
  setSelectedMachine: (val: Machine | null) => void;
  toggleAside: () => void;
  handleFormSubmit: (formData: any) => void;
  handleEditClick: (project: Project) => void;
  handleEditLiner: (liner: Liner) => void;
  handleEditMachine: (machine: Machine) => void;
  handleDeleteProject: (id: string) => void;
  handleDeleteLiner: (id: string) => void;
  handleDeleteMachine: (id: string) => void;
  handleUpdateLiner: (id: string, formData: any) => Promise<void>;
  handleUpdateMachine: (id: string, formData: any) => Promise<void>;
  handleCancelForm: () => void;
  fetchProjects: () => void;
  fetchLiners: () => void;
  fetchMachines: () => void;
  materials: Material[];
  fetchMaterials: () => void;
}

const ProyectoContext = createContext<ProyectoContextType | undefined>(undefined);

// Versión de la aplicación para forzar actualización de PWA
const APP_VERSION = process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0";

export function ProyectoProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isLogged, isLoading: isAuthLoading } = useAuth();
  const { setPageMenuContent, setLandscapeSidebarOpen } = useMobile();
  const [isAsideOpen, setIsAsideOpen] = useState(false);
  const [isAsideVisible, setIsAsideVisible] = useState(false);

  // Lógica de actualización de versión para PWA
  useEffect(() => {
    const savedVersion = localStorage.getItem("app_version");
    if (savedVersion && savedVersion !== APP_VERSION) {
      console.log(`Nueva versión detectada: ${APP_VERSION}. Actualizando...`);
      localStorage.setItem("app_version", APP_VERSION);

      // Forzar recarga limpia para actualizar Service Worker y cache
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(registrations => {
          for (const registration of registrations) {
            registration.update();
          }
        });
      }

      window.location.reload();
    } else if (!savedVersion) {
      localStorage.setItem("app_version", APP_VERSION);
    }
  }, []);

  const [projects, setProjects] = useState<Project[]>([]);
  const [liners, setLiners] = useState<Liner[]>([]);
  const [machines, setMachines] = useState<Machine[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingLiner, setEditingLiner] = useState<Liner | null>(null);
  const [editingMachine, setEditingMachine] = useState<Machine | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedLiner, setSelectedLiner] = useState<Liner | null>(null);
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);
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

  const fetchMaterials = useCallback(async () => {
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) return;
      const response = await fetch(`${API_BASE_URL}/materials/`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (response.ok) setMaterials(await response.json());
    } catch (err) { console.error("Error fetching materials:", err); }
  }, [API_BASE_URL]);

  useEffect(() => {
    if (isLogged) {
      fetchProjects();
      fetchLiners();
      fetchMachines();
      fetchMaterials();
    } else if (!isAuthLoading) {
      // Clear data when logged out
      setProjects([]);
      setLiners([]);
      setMachines([]);
      setMaterials([]);
      setLoading(false);
    }
  }, [isLogged, isAuthLoading, fetchProjects, fetchLiners, fetchMachines, fetchMaterials]);

  // Auto-seleccionar el proyecto más recientemente modificado
  useEffect(() => {
    if (projects.length > 0 && !selectedProject) {
      const latest = [...projects].sort((a, b) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      )[0];
      setSelectedProject(latest);
    }
  }, [projects, selectedProject]);


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

  const handleCreateProject = useCallback(async (formData: any) => {
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

  const handleUpdateProject = useCallback(async (formData: any) => {
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
      const headers: HeadersInit = { "Authorization": `Bearer ${token}` };

      const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
        method: "DELETE",
        headers,
      });

      if (!response.ok) throw new Error("Error al eliminar proyecto");

      setProjects((prev) => prev.filter((p) => p.id !== id));
      if (selectedProject?.id === id) setSelectedProject(null);
      alert("Proyecto eliminado exitosamente");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    }
  }, [API_BASE_URL, selectedProject]);

  const handleDeleteLiner = useCallback(async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este liner?")) return;

    try {
      const token = localStorage.getItem("auth_token");
      const headers: HeadersInit = { "Authorization": `Bearer ${token}` };

      const response = await fetch(`${API_BASE_URL}/liners/${id}`, {
        method: "DELETE",
        headers,
      });

      if (!response.ok) throw new Error("Error al eliminar liner");

      setLiners((prev) => prev.filter((l) => l.id !== id));
      if (selectedLiner?.id === id) setSelectedLiner(null);
      alert("Liner eliminado exitosamente");
    } catch (err) {
      alert("Error: " + (err instanceof Error ? err.message : "Desconocido"));
    }
  }, [API_BASE_URL, selectedLiner]);

  const handleDeleteMachine = useCallback(async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar esta máquina?")) return;

    try {
      const token = localStorage.getItem("auth_token");
      const headers: HeadersInit = { "Authorization": `Bearer ${token}` };

      const response = await fetch(`${API_BASE_URL}/machines/${id}`, {
        method: "DELETE",
        headers,
      });

      if (!response.ok) throw new Error("Error al eliminar máquina");

      setMachines((prev) => prev.filter((m) => m.id !== id));
      if (selectedMachine?.id === id) setSelectedMachine(null);
      alert("Máquina eliminada exitosamente");
    } catch (err) {
      alert("Error: " + (err instanceof Error ? err.message : "Desconocido"));
    }
  }, [API_BASE_URL, selectedMachine]);

  const handleUpdateLiner = useCallback(async (id: string, formData: any) => {
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("auth_token");
      const response = await fetch(`${API_BASE_URL}/liners/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Error al actualizar liner");

      await fetchLiners();
      setEditingLiner(null);
      alert("Liner actualizado exitosamente");
    } catch (err) {
      alert("Error: " + (err instanceof Error ? err.message : "Desconocido"));
    } finally {
      setIsSubmitting(false);
    }
  }, [API_BASE_URL, fetchLiners]);

  const handleUpdateMachine = useCallback(async (id: string, formData: any) => {
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("auth_token");
      const response = await fetch(`${API_BASE_URL}/machines/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Error al actualizar máquina");

      await fetchMachines();
      setEditingMachine(null);
      alert("Máquina actualizada exitosamente");
    } catch (err) {
      alert("Error: " + (err instanceof Error ? err.message : "Desconocido"));
    } finally {
      setIsSubmitting(false);
    }
  }, [API_BASE_URL, fetchMachines]);

  const handleFormSubmit = useCallback((formData: any) => {
    if (editingProject) {
      handleUpdateProject(formData);
    } else {
      handleCreateProject(formData);
    }
  }, [editingProject, handleUpdateProject, handleCreateProject]);

  const handleEditClick = useCallback((project: Project) => {
    setEditingLiner(null);
    setEditingMachine(null);
    setEditingProject(project);
    setShowForm(false);
  }, []);

  const handleEditLiner = useCallback((liner: Liner) => {
    setEditingProject(null);
    setEditingMachine(null);
    setEditingLiner(liner);
  }, []);

  const handleEditMachine = useCallback((machine: Machine) => {
    setEditingProject(null);
    setEditingLiner(null);
    setEditingMachine(machine);
  }, []);

  const handleCancelForm = useCallback(() => {
    setShowForm(false);
    setEditingProject(null);
    setEditingLiner(null);
    setEditingMachine(null);
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
    editingLiner,
    setEditingLiner,
    editingMachine,
    setEditingMachine,
    selectedProject,
    setSelectedProject,
    selectedLiner,
    setSelectedLiner,
    selectedMachine,
    setSelectedMachine,
    isSubmitting,
    isAsideOpen,
    isAsideVisible,
    toggleAside,
    handleFormSubmit,
    handleEditClick,
    handleEditLiner,
    handleEditMachine,
    handleDeleteProject,
    handleDeleteLiner,
    handleDeleteMachine,
    handleUpdateLiner,
    handleUpdateMachine,
    handleCancelForm,
    fetchProjects,
    fetchLiners,
    fetchMachines,
    materials,
    fetchMaterials,
  }), [
    projects, liners, machines, loading, error, showForm, editingProject, editingLiner, editingMachine,
    selectedProject, selectedLiner, selectedMachine,
    isSubmitting, isAsideOpen, isAsideVisible, toggleAside,
    handleFormSubmit, handleEditClick, handleEditLiner, handleEditMachine, handleDeleteProject,
    handleDeleteLiner, handleDeleteMachine, handleUpdateLiner, handleUpdateMachine, handleCancelForm,
    fetchProjects, fetchLiners, fetchMachines, materials, fetchMaterials
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
