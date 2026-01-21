"use client";

import React, { useState, useEffect } from "react";
import { useProyecto } from "../ProyectoContext";
import AsideProyecto from "@/app/components/AsideProyecto";

export default function ProyectoAside() {
    const {
        selectedProject,
        handleDeleteProject,
        handleFormSubmit,
        isSubmitting,
        setEditingProject,
    } = useProyecto();

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ name: "", description: "" });

    // Cuando cambia el proyecto seleccionado (por ID), reseteamos el formulario y el modo edición
    useEffect(() => {
        if (selectedProject) {
            setFormData({
                name: selectedProject.name,
                description: selectedProject.description,
            });
            setIsEditing(false);
        } else {
            setFormData({ name: "", description: "" });
            setIsEditing(false);
        }
    }, [selectedProject?.id]); // Solo disparar si cambia el ID del proyecto

    if (!selectedProject) {
        return (
            <div className="h-full flex items-center justify-center p-4">
                <AsideProyecto />
            </div>
        );
    }

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const onUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        handleFormSubmit(formData);
        setIsEditing(false);
    };

    return (
        <div className="h-full overflow-y-auto p-6 bg-blue-100 flex flex-col gap-6">
            <div>
                <h2 className="text-xl font-bold text-blue-950 mb-6 border-b border-blue-200 pb-2">
                    Detalles del Proyecto
                </h2>

                <form onSubmit={onUpdate} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-blue-900 mb-1">
                            Nombre
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            disabled={!isEditing}
                            autoFocus={isEditing}
                            className={`w-full px-3 py-2 border rounded-md transition-colors ${
                                isEditing
                                    ? "bg-white border-blue-600 ring-2 ring-blue-100 outline-none"
                                    : "bg-blue-50 border-transparent text-gray-700 cursor-not-allowed"
                            }`}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-blue-900 mb-1">
                            Descripción
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            disabled={!isEditing}
                            rows={3}
                            className={`w-full px-3 py-2 border rounded-md transition-colors ${
                                isEditing
                                    ? "bg-white border-blue-400 focus:ring-2 focus:ring-blue-500"
                                    : "bg-blue-50 border-transparent text-gray-700 cursor-not-allowed"
                            }`}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2">
                        <div>
                            <label className="block text-xs font-semibold text-blue-800 uppercase">
                                Creación
                            </label>
                            <div className="text-sm text-gray-600">
                                {new Date(selectedProject.created_at).toLocaleDateString()}
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-blue-800 uppercase">
                                Modificación
                            </label>
                            <div className="text-sm text-gray-600">
                                {new Date(selectedProject.updated_at).toLocaleDateString()}
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex flex-col gap-3">
                        {!isEditing ? (
                            <>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsEditing(true);
                                        setEditingProject(selectedProject);
                                    }}
                                    className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-sm"
                                >
                                    Editar
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleDeleteProject(selectedProject.id)}
                                    className="w-full py-2 bg-red-100 text-red-600 border border-red-200 rounded-md hover:bg-red-200 transition-colors"
                                >
                                    Eliminar
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors shadow-sm disabled:opacity-50"
                                >
                                    {isSubmitting ? "Guardando..." : "Modificar Proyecto"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsEditing(false);
                                        setEditingProject(null);
                                        setFormData({
                                            name: selectedProject.name,
                                            description: selectedProject.description,
                                        });
                                    }}
                                    className="w-full py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                                >
                                    Cancelar
                                </button>
                            </>
                        )}
                    </div>
                </form>
            </div>

            <hr className="border-blue-200" />

            <AsideProyecto />
        </div>
    );
}
