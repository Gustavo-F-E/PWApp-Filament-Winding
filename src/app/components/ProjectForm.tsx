"use client";

import React, { useState, useEffect } from "react";

interface Project {
    id: string;
    name: string;
    description: string;
    user_email: string;
    created_at?: string;
    updated_at?: string;
}

interface ProjectFormProps {
    project?: Project | null;
    onSubmit: (data: { name: string; description: string }) => void;
    onCancel: () => void;
    isSubmitting?: boolean;
}

const ProjectForm: React.FC<ProjectFormProps> = ({
    project,
    onSubmit,
    onCancel,
    isSubmitting = false,
}) => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
    });

    // Inicializar con datos del proyecto si existe (para edición)
    useEffect(() => {
        if (project) {
            setFormData({
                name: project.name || "",
                description: project.description || "",
            });
        } else {
            setFormData({
                name: "",
                description: "",
            });
        }
    }, [project]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-6 p-4 bg-white rounded-lg shadow"
        >
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre del Proyecto *
                </label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ingresa el nombre del proyecto"
                    disabled={isSubmitting}
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción
                </label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe el proyecto"
                    disabled={isSubmitting}
                />
            </div>

            <div className="flex justify-end space-x-4 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                    disabled={isSubmitting}
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                    {isSubmitting ? (
                        <>
                            <svg
                                className="animate-spin h-4 w-4 mr-2 text-white"
                                xmlns="http://www.w3.org/2000/svg"
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
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                            {project ? "Actualizando..." : "Creando..."}
                        </>
                    ) : (
                        <>
                            {project ? "Actualizar Proyecto" : "Crear Proyecto"}
                        </>
                    )}
                </button>
            </div>
        </form>
    );
};

export default ProjectForm;
