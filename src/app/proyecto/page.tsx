"use client";

import React, { useEffect, useState } from "react";
import MenuProyecto from "../components/MenuProyecto";
import { useMobile } from "@/context/MobileContext";
import AsideProyecto from "../components/AsideProyecto";
import ProjectForm from "../components/ProjectForm";

interface Project {
    id: string;
    name: string;
    description: string;
    user_email: string;
    created_at: string;
    updated_at: string;
}

export default function Proyecto() {
    const { setPageMenuContent, setLandscapeSidebarOpen } = useMobile();
    const [isAsideOpen, setIsAsideOpen] = useState(false);
    const [isAsideVisible, setIsAsideVisible] = useState(false);

    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const API_BASE_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

    // Cargar proyectos
    useEffect(() => {
        fetchProjects();
    }, []);

    useEffect(() => {
        setPageMenuContent(<MenuProyecto mobileMode={true} />);
        setLandscapeSidebarOpen(true);
    }, [setPageMenuContent, setLandscapeSidebarOpen]);

    const toggleAside = () => {
        if (isAsideOpen) {
            setIsAsideOpen(false);
            setTimeout(() => setIsAsideVisible(false), 300);
        } else {
            setIsAsideVisible(true);
            requestAnimationFrame(() => {
                requestAnimationFrame(() => setIsAsideOpen(true));
            });
        }
    };

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("access_token");
            const headers: HeadersInit = {
                "Content-Type": "application/json",
            };

            if (token) {
                headers["Authorization"] = `Bearer ${token}`;
            }

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
    };

    const handleCreateProject = async (formData: {
        name: string;
        description: string;
    }) => {
        try {
            setIsSubmitting(true);
            const token = localStorage.getItem("access_token");
            const headers: HeadersInit = {
                "Content-Type": "application/json",
            };

            if (token) {
                headers["Authorization"] = `Bearer ${token}`;
            }

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
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error desconocido");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateProject = async (formData: {
        name: string;
        description: string;
    }) => {
        if (!editingProject) return;

        try {
            setIsSubmitting(true);
            const token = localStorage.getItem("access_token");
            const headers: HeadersInit = {
                "Content-Type": "application/json",
            };

            if (token) {
                headers["Authorization"] = `Bearer ${token}`;
            }

            const response = await fetch(
                `${API_BASE_URL}/projects/${editingProject.id}`,
                {
                    method: "PUT",
                    headers,
                    body: JSON.stringify(formData),
                }
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(
                    errorData.detail || "Error al actualizar proyecto"
                );
            }

            const updatedProject = await response.json();
            setProjects((prev) =>
                prev.map((p) =>
                    p.id === editingProject.id ? updatedProject : p
                )
            );
            setEditingProject(null);
            setShowForm(false);
            alert("Proyecto actualizado exitosamente");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error desconocido");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteProject = async (id: string) => {
        if (!confirm("¿Estás seguro de eliminar este proyecto?")) return;

        try {
            const token = localStorage.getItem("access_token");
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
                throw new Error(
                    errorData.detail || "Error al eliminar proyecto"
                );
            }

            setProjects((prev) => prev.filter((p) => p.id !== id));
            alert("Proyecto eliminado exitosamente");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error desconocido");
        }
    };

    const handleFormSubmit = (formData: {
        name: string;
        description: string;
    }) => {
        if (editingProject) {
            handleUpdateProject(formData);
        } else {
            handleCreateProject(formData);
        }
    };

    const handleEditClick = (project: Project) => {
        setEditingProject(project);
        setShowForm(true);
    };

    const handleCancelForm = () => {
        setShowForm(false);
        setEditingProject(null);
    };

    return (
        <section className="h-full w-full flex flex-col lg:grid lg:grid-rows-[repeat(23,1fr)] lg:grid-cols-[repeat(18,1fr)] overflow-hidden">
            {/* Mobile Toggle Button */}
            <div className="relative lg:hidden">
                <button
                    className={`
            absolute top-[40vh] right-[0vw] landscape:top-[50vh] landscape:right-[0vw] 
            bg-blue-950 text-white p-2 rounded-l-md transform -translate-y-1/2 shadow-lg z-40 
            transition-all duration-300 ease-in-out
            ${isAsideOpen ? "right-[90vw] landscape:right-[50vw]" : "right-0"}
            hover:bg-blue-900 hover:scale-105 active:scale-95
          `}
                    onClick={toggleAside}
                >
                    <span className="block transform transition-transform duration-300">
                        {isAsideOpen ? ">>" : "<<"}
                    </span>
                </button>
            </div>

            {/* menú superior interno */}
            <header className="hidden lg:block lg:row-[1/7] lg:col-[1/19] bg-blue-300">
                <MenuProyecto />
            </header>

            {/* contenido principal */}
            <main
                className={`
          flex-1 w-full lg:row-[7/24] lg:col-[1/13] bg-blue-50 lg:grid lg:grid-rows-[repeat(17,1fr)] lg:grid-cols-[repeat(12,1fr)] lg:h-full
          transition-all duration-300 ease-in-out overflow-hidden
          ${isAsideOpen ? "lg:block" : "block"}
          ${
              isAsideOpen
                  ? "transform -translate-x-[90vw] landscape:-translate-x-[50vw]"
                  : "translate-x-0"
          }
      `}
            >
                <div className="lg:row-[1/18] lg:col-[1/13] overflow-auto h-full p-4">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-blue-950">
                            Gestión de Proyectos
                        </h1>
                        <button
                            onClick={() => {
                                setEditingProject(null);
                                setShowForm(true);
                            }}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                            + Nuevo Proyecto
                        </button>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                            {error}
                        </div>
                    )}

                    {showForm && (
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold text-blue-950 mb-4">
                                {editingProject
                                    ? "Editar Proyecto"
                                    : "Crear Nuevo Proyecto"}
                            </h2>
                            <ProjectForm
                                project={editingProject}
                                onSubmit={handleFormSubmit}
                                onCancel={handleCancelForm}
                                isSubmitting={isSubmitting}
                            />
                        </div>
                    )}

                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                    ) : projects.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            No hay proyectos registrados. ¡Crea tu primer
                            proyecto!
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Nombre
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Descripción
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Creado por
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Creado
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {projects.map((project) => (
                                        <tr
                                            key={project.id}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="font-medium text-gray-900">
                                                    {project.name}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-gray-700 max-w-xs truncate">
                                                    {project.description}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                                {project.user_email}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                                {new Date(
                                                    project.created_at
                                                ).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button
                                                    onClick={() =>
                                                        handleEditClick(project)
                                                    }
                                                    className="text-blue-600 hover:text-blue-900 mr-4"
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDeleteProject(
                                                            project.id
                                                        )
                                                    }
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Eliminar
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>

            {/* aside derecho para mobile */}
            {isAsideVisible && (
                <div
                    className={`
            lg:hidden fixed inset-0 z-20
            transition-opacity duration-300 ease-in-out
            ${isAsideOpen ? "opacity-100" : "opacity-0 pointer-events-none"}
          `}
                    onClick={() => isAsideOpen && toggleAside()}
                >
                    <aside
                        id="asideProyecto"
                        className={`
              fixed right-0 top-[10vh] landscape:top-[0vh] h-full z-30 border-2 border-blue-200 bg-blue-100
              transform transition-transform duration-300 ease-in-out
              ${isAsideOpen ? "translate-x-0" : "translate-x-full"}
              w-[90vw] landscape:w-[75vw]
            `}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="h-full overflow-y-auto p-4">
                            <AsideProyecto />
                        </div>
                    </aside>
                </div>
            )}

            {/* aside derecho para desktop */}
            <aside className="hidden lg:block lg:row-[7/24] lg:col-[13/19] bg-blue-100 lg:h-full">
                <AsideProyecto />
            </aside>
        </section>
    );
}
