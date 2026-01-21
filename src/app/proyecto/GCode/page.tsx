"use client";

import React, { useState } from "react";
import { useProyecto } from "../ProyectoContext";

export default function GCodePage() {
    const { projects } = useProyecto();
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

    // Ordenar proyectos de más nuevo a más antiguo por fecha de modificación
    const sortedProjects = [...projects].sort((a, b) => 
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    );

    const selectedProject = projects.find(p => p.id === selectedProjectId);
    const isReady = selectedProject?.completion_percentage === 100;

    return (
        <div className="p-6 max-w-5xl mx-auto bg-white rounded-xl shadow-md border border-blue-50">
            <h1 className="text-2xl font-bold text-blue-950 mb-6 border-b pb-2">Generación de G-Code</h1>
            
            <p className="text-gray-600 mb-8">
                Selecciona un proyecto finalizado para generar su código de manufactura.
                <span className="block mt-1 text-sm text-blue-600 font-semibold">
                    * El botón se activará solo cuando el proyecto alcance el 100% de definición.
                </span>
            </p>

            <div className="overflow-hidden border border-gray-200 rounded-lg mb-8">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Sel.</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Proyecto</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Modificación</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Progreso</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {sortedProjects.map((project) => (
                            <tr 
                                key={project.id} 
                                className={`hover:bg-blue-50 cursor-pointer transition-colors ${selectedProjectId === project.id ? "bg-blue-100" : ""}`}
                                onClick={() => setSelectedProjectId(project.id)}
                            >
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <input 
                                        type="radio" 
                                        name="gcode-project" 
                                        checked={selectedProjectId === project.id}
                                        onChange={() => setSelectedProjectId(project.id)}
                                        className="accent-blue-600"
                                    />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-bold text-gray-900">{project.name}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(project.updated_at).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-3">
                                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full transition-all ${project.completion_percentage === 100 ? "bg-green-500" : "bg-blue-400"}`}
                                                style={{ width: `${project.completion_percentage}%` }}
                                            />
                                        </div>
                                        <span className={`text-xs font-bold ${project.completion_percentage === 100 ? "text-green-600" : "text-gray-500"}`}>
                                            {project.completion_percentage}%
                                        </span>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-center pt-4">
                <button
                    disabled={!isReady}
                    className={`px-12 py-4 rounded-full font-bold text-lg shadow-lg transition-all transform hover:scale-105 active:scale-95 ${
                        isReady 
                        ? "bg-green-600 text-white cursor-pointer hover:bg-green-700" 
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                    onClick={() => alert("Generando G-Code para: " + selectedProject?.name)}
                >
                    MODO G-CODE: GENERAR CÓDIGO
                </button>
            </div>
        </div>
    );
}
