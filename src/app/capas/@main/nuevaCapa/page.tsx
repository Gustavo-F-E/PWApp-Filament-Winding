// src/app/capas/@main/nuevaCapa/page.tsx

"use client";

import React from "react";
import { useCapas } from "../../../capas/CapasContext";
import { useProyecto } from "../../../proyecto/ProyectoContext";
import { useRouter } from "next/navigation";

export default function NuevaCapaPage() {
  const { isSubmitting, layerDraft, setLayerDraft, handleAddLayer } = useCapas();
  const { materials, projects, selectedProject, setSelectedProject } = useProyecto();
  const router = useRouter();

  const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const projectId = e.target.value;
    const project = projects.find(p => p.id === projectId);
    if (project) {
      setSelectedProject(project);
    }
  };

  const handleMaterialChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const materialName = e.target.value;
    if (!materialName) return;

    const selectedMat = materials.find(m => m.name === materialName);
    if (selectedMat) {
      setLayerDraft(prev => ({
        ...prev,
        material_name: selectedMat.name,
      }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setLayerDraft(prev => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Si ya tenemos material (material_name) y patrón, podemos crear la capa directamente
    if (layerDraft.material_name && layerDraft.patron_elegido) {
      await handleAddLayer();
      router.push("/capas");
    } else if (!layerDraft.material_name) {
      alert("Por favor, selecciona un material antes de continuar");
    } else {
      router.push("/capas/seleccionarPatron");
    }
  };

  const onCancel = () => {
    router.back();
  };

  return (
    <div className="flex-1 overflow-y-auto col-[1/13] lg:grid lg:grid-rows-[repeat(17,1fr)] h-full">
      <div className="row-[1/18] lg:col-[1/13] p-4 text-white-500">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-blue-950 mb-4">
            Crear Nueva Capa
          </h1>
          <form
            onSubmit={onSubmit}
            className="space-y-6 p-6 bg-white rounded-lg shadow-lg border border-blue-100"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-blue-900">
                Nueva Capa
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-white-700 mb-1">
                  Proyecto Asociado
                </label>
                <select
                  value={selectedProject?.id || ""}
                  onChange={handleProjectChange}
                  className="w-full px-3 py-2 text-white-700 border border-white-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                  disabled={isSubmitting}
                  required
                >
                  <option value="" disabled>Seleccionar Proyecto</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-white-700 mb-1">
                  Nombre de la Capa
                </label>
                <input
                  type="text"
                  name="name"
                  value={layerDraft.name || ""}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 text-white-700 border border-white-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Nombre identificativo"
                  disabled={isSubmitting}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-white-700 mb-1">
                  Descripción
                </label>
                <textarea
                  name="description"
                  value={layerDraft.description || ""}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-3 py-2 text-white-700 border border-white-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Descripción breve"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white-700 mb-1">
                  Ángulo (alfa)
                </label>
                <select
                  name="alfa_original"
                  value={layerDraft.alfa_original || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-white-700 border border-white-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">Seleccionar Ángulo</option>
                  <option value="hoop_ida">HOOP (ida)</option>
                  {[5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89].map(a => (
                    <option key={a} value={a}>±{a}°</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white-700 mb-1">
                  Pines
                </label>
                <select
                  name="pines"
                  value={layerDraft.pines ? "1" : "0"}
                  onChange={(e) => setLayerDraft(prev => ({ ...prev, pines: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 text-white-700 border border-white-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="1">Sí</option>
                  <option value="0">No</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white-700 mb-1">
                  Corregir ángulo
                </label>
                <select
                  name="corregir_angulo"
                  value={layerDraft.corregir_angulo ? "true" : "false"}
                  onChange={(e) => setLayerDraft(prev => ({ ...prev, corregir_angulo: e.target.value === "true" }))}
                  className="w-full px-3 py-2 text-white-700 border border-white-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="true">Sí</option>
                  <option value="false">No</option>
                </select>
              </div>

              <div className="md:col-span-2 border-t pt-4 mt-2">
                <h4 className="text-md font-semibold text-blue-900 mb-3">Material</h4>
                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white-700 mb-1">
                      Seleccionar Material *
                    </label>
                    {materials.length > 0 ? (
                      <>
                        <select
                          value={layerDraft.material_name || ""}
                          onChange={handleMaterialChange}
                          className="w-full px-3 py-2 text-white-700 border border-white-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                          required
                        >
                          <option value="">-- Elegir Material --</option>
                          {materials.map(m => (
                            <option key={m.id} value={m.name}>{m.name}</option>
                          ))}
                        </select>
                        {layerDraft.material_name && materials.find(m => m.name === layerDraft.material_name) && (
                          <div className="mt-2 text-xs text-blue-700 bg-blue-50 p-2 rounded border border-blue-100">
                            <div><strong>Ancho:</strong> {materials.find(m => m.name === layerDraft.material_name)?.ancho} mm</div>
                            <div><strong>Espesor:</strong> {materials.find(m => m.name === layerDraft.material_name)?.espesor} mm</div>
                            <div><strong>Coef. Rozamiento:</strong> {materials.find(m => m.name === layerDraft.material_name)?.coeficiente_rozamiento}</div>
                          </div>
                        )}
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => router.push("/capas/material")}
                        className="w-full px-3 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors text-sm font-medium"
                      >
                        + Crear Primer Material
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-4 border-t border-white-100">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 border border-white-300 rounded-md text-white-700 hover:bg-white-50 transition-colors"
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-blue-600 text-white-50 font-semibold rounded-md hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
              >
                {layerDraft.material_name && layerDraft.patron_elegido
                  ? (isSubmitting ? "Creando..." : "Crear Capa")
                  : "Siguiente"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
