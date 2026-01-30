import React, { useState, useEffect } from "react";
import { useProyecto } from "../proyecto/ProyectoContext";
import { useRouter } from "next/navigation";

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
  const { liners, machines, editingProject: project, handleClearLayers } = useProyecto();
  const router = useRouter();
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

  const hasLayers = project?.layers && project.layers.length > 0;
  const layersListName = project ? `_layers_${project.name.replace(/\s+/g, "_")}` : "";

  const calculatePercentage = () => {
    let p = 0;
    if (formData.description) p += 10;
    if (formData.liner_name) p += 30;
    if (formData.machine_name) p += 30;
    if (hasLayers) p += 30;
    return p;
  };

  const percentage = calculatePercentage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleLayersAction = () => {
    router.push("/capas");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 p-6 bg-white-50 rounded-lg shadow-lg border border-blue-100"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-blue-900">
          {project ? "Configurar Proyecto" : "Nuevo Proyecto"}
        </h3>
        <div className="text-right">
          <span className="text-sm font-semibold text-gray-500 block">Definición</span>
          <div className="w-32 h-2 bg-gray-200 rounded-full mt-1 overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <span className="text-xs font-bold text-blue-600">{percentage}%</span>
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

        {/* Sección de Capas solo para proyectos existentes */}
        {project && (
          <div className="md:col-span-2 pt-4 mt-2 border-t border-blue-100">
            <label className="block text-sm font-bold text-blue-900 mb-3 uppercase tracking-wider">
              Gestión de Capas
            </label>
            <div className="flex flex-col items-stretch p-4 bg-white rounded-lg border border-blue-200 shadow-sm gap-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${hasLayers ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className={`text-sm font-mono font-bold truncate ${hasLayers ? 'text-blue-900' : 'text-gray-400'}`}>
                    {layersListName}
                  </span>
                  <span className="text-xs text-gray-500 italic">
                    {hasLayers ? `${project.layers.length} capas definidas` : "No hay capas creadas"}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 w-full pt-2 border-t border-blue-50">
                {!hasLayers ? (
                  <button
                    type="button"
                    onClick={handleLayersAction}
                    className="flex-1 px-3 py-1.5 bg-blue-50 text-blue-700 font-bold rounded-md border border-blue-200 hover:bg-blue-100 transition-colors text-xs"
                  >
                    Crear lista de capas
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={handleLayersAction}
                      className="flex-1 px-3 py-1.5 bg-blue-50 text-blue-700 font-bold rounded-md border border-blue-200 hover:bg-blue-100 transition-colors text-xs"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleClearLayers(project.id)}
                      className="flex-1 px-3 py-1.5 bg-red-50 text-red-700 font-bold rounded-md border border-red-200 hover:bg-red-100 transition-colors text-xs"
                    >
                      Borrar
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
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
