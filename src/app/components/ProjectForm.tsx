import React, { useState, useEffect } from "react";
import { useProyecto } from "../proyecto/ProyectoContext";

interface ProjectFormProps {
    onSubmit: (data: any) => void;
    onCancel: () => void;
    isSubmitting?: boolean;
}

const ProjectForm: React.FC<ProjectFormProps> = ({
    onSubmit,
    onCancel,
    isSubmitting = false,
}) => {
    const { liners, machines, editingProject: project } = useProyecto();
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        liner_name: "",
        machine_name: "",
    });

    useEffect(() => {
        if (project) {
            setFormData({
                name: project.name || "",
                description: project.description || "",
                liner_name: project.liner_name || "",
                machine_name: project.machine_name || "",
            });
        }
    }, [project]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const calculatePercentage = () => {
        let p = 0;
        if (formData.description) p += 10;
        if (formData.liner_name) p += 30;
        if (formData.machine_name) p += 30;
        // Capas se mantienen en 0 por ahora hasta que se implementen
        return p;
    };

    const percentage = calculatePercentage();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-6 p-6 bg-white rounded-lg shadow-lg border border-blue-100"
        >
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-blue-900">
                    {project ? "Configurar Proyecto" : "Nuevo Proyecto"}
                </h3>
                <div className="text-right">
                    <span className="text-sm font-semibold text-gray-500 block">Definición</span>
                    <div className="w-32 h-2 bg-gray-200 rounded-full mt-1 overflow-hidden">
                        <div 
                            className="h-full bg-green-500 transition-all duration-500" 
                            style={{ width: `${percentage}%` }}
                        />
                    </div>
                    <span className="text-xs font-bold text-green-600">{percentage}%</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre del Proyecto *
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="Nombre identificativo"
                        disabled={isSubmitting}
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Descripción
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={2}
                        className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="Descripción breve (Añade 10% de definición)"
                        disabled={isSubmitting}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Seleccionar Liner
                    </label>
                    <select
                        name="liner_name"
                        value={formData.liner_name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                        disabled={isSubmitting}
                    >
                        <option value="">-- Sin Liner --</option>
                        {liners.map(liner => (
                            <option key={liner.id} value={liner.name}>{liner.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Seleccionar Máquina
                    </label>
                    <select
                        name="machine_name"
                        value={formData.machine_name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                        disabled={isSubmitting}
                    >
                        <option value="">-- Sin Máquina --</option>
                        {machines.map(m => (
                            <option key={m.id} value={m.name}>{m.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="flex justify-end space-x-4 pt-4 border-t border-gray-100">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                    disabled={isSubmitting}
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
                >
                    {isSubmitting ? "Guardando..." : (project ? "Actualizar" : "Crear Proyecto")}
                </button>
            </div>
        </form>
    );
};

export default ProjectForm;
