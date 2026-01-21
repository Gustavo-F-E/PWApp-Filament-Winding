//src\app\proyecto\@main\page.tsx

"use client";

import React from "react";
import ProjectForm from "../../components/ProjectForm";
import { useProyecto } from "../ProyectoContext";

export default function ProyectoMain() {
    const {
        projects,
        loading,
        error,
        showForm,
        editingProject,
        isSubmitting,
        handleFormSubmit,
        handleEditClick,
        handleDeleteProject,
        handleCancelForm,
        setEditingProject,
        setShowForm,
        selectedProject,
        setSelectedProject,
    } = useProyecto();

    return (
        <div className="flex-1 overflow-y-auto col-[1/13] lg:grid lg:grid-rows-[repeat(17,1fr)] h-full">
            <div className="row-[1/18] lg:col-[1/13] p-4">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-blue-950">
                    Gestión de Proyectos
                </h1>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
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
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                                    Selección
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Proyecto
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Última Modificación
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {projects.map((project) => (
                                <tr
                                    key={project.id}
                                    className={`hover:bg-gray-50 cursor-pointer ${
                                        selectedProject?.id === project.id
                                            ? "bg-blue-50 font-bold"
                                            : ""
                                    }`}
                                    onClick={() => setSelectedProject(project)}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <input
                                            type="radio"
                                            name="proyecto-seleccionado"
                                            checked={selectedProject?.id === project.id}
                                            onChange={() => setSelectedProject(project)}
                                            className="h-5 w-5 accent-blue-600 cursor-pointer"
                                        />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className={`font-medium text-gray-900 ${
                                            selectedProject?.id === project.id
                                                ? "font-bold text-blue-800"
                                                : ""
                                        }`}>
                                            {project.name}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                        {new Date(
                                            project.created_at
                                        ).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            </div>
        </div>
    );
}
