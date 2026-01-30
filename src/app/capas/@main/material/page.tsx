// src/app/capas/@main/material/page.tsx

"use client";

import React, { useState } from "react";
import { useCapas } from "../../../capas/CapasContext";
import { useProyecto } from "../../../proyecto/ProyectoContext";
import { useRouter } from "next/navigation";
import { handleNumericChangeValidation } from "@/utils/validation";

export default function MaterialCapaPage() {
  const { isSubmitting, layerDraft, setLayerDraft } = useCapas();
  const { materials, fetchMaterials } = useProyecto();
  const router = useRouter();

  const [mode, setMode] = useState<"existing" | "new">("new");
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>("");
  const [isSavingMaterial, setIsSavingMaterial] = useState(false);

  // Estados locales para Nombre y Descripción si se crea nuevo
  const [materialName, setMaterialName] = useState("");
  const [materialDescription, setMaterialDescription] = useState("");

  const API_BASE_URL = process.env.NEXT_PUBLIC_URL_BACKEND || "http://localhost:8000";

  const onValidationError = (msg: string) => {
    alert(msg);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    handleNumericChangeValidation(e, onValidationError);
    const { name, value } = e.target;

    if (name === "materialName") {
      setMaterialName(value);
      return;
    }
    if (name === "materialDescription") {
      setMaterialDescription(value);
      return;
    }

    setLayerDraft(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const handleModeChange = (newMode: "existing" | "new") => {
    setMode(newMode);
    if (newMode === "new") {
      setSelectedMaterialId("");
    }
  };

  const handleExistingSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const materialId = e.target.value;
    setSelectedMaterialId(materialId);

    if (materialId) {
      const sourceMaterial = materials.find((m: any) => m.id === materialId || m._id === materialId);
      if (sourceMaterial) {
        setLayerDraft(prev => ({
          ...prev,
          name: sourceMaterial.name,
          description: sourceMaterial.description || "",
          espesor: sourceMaterial.espesor,
          ancho: sourceMaterial.ancho,
          coeficiente_rozamiento: sourceMaterial.coeficiente_rozamiento
        }));
      }
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Actualizar el draft con el nombre y descripción seleccionados/ingresados
    if (mode === "new") {
      setLayerDraft(prev => ({ ...prev, name: materialName, description: materialDescription }));
    }

    if (mode === "new") {
      try {
        setIsSavingMaterial(true);
        const token = localStorage.getItem("auth_token");
        if (!token) throw new Error("No hay sesión activa");

        const materialData = {
          name: materialName || `Material ${new Date().toLocaleDateString()}`,
          description: materialDescription,
          espesor: layerDraft.espesor,
          ancho: layerDraft.ancho,
          coeficiente_rozamiento: layerDraft.coeficiente_rozamiento
        };

        const response = await fetch(`${API_BASE_URL}/materials/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(materialData),
        });

        if (response.ok) {
          await fetchMaterials(); // Recargar biblioteca global
        }
      } catch (err) {
        console.error("Error saving material to library:", err);
      } finally {
        setIsSavingMaterial(false);
      }
    }

    router.push("/capas/seleccionarPatron");
  };

  const onCancel = () => {
    router.back();
  };

  return (
    <div className="flex-1 overflow-y-auto col-[1/13] lg:grid lg:grid-rows-[repeat(17,1fr)] h-full">
      <div className="row-[1/18] lg:col-[1/13] p-4 text-gray-500">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-blue-950 mb-4">
            Definir Material de la Capa
          </h1>

          <div className="mb-6 flex space-x-4">
            <button
              onClick={() => handleModeChange("new")}
              type="button"
              className={`px-4 py-2 rounded-md font-semibold transition-colors ${mode === "new"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-white text-blue-600 border border-blue-600 hover:bg-blue-50"
                }`}
            >
              Crear Nuevo Material
            </button>
            <button
              onClick={() => handleModeChange("existing")}
              type="button"
              className={`px-4 py-2 rounded-md font-semibold transition-colors ${mode === "existing"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-white text-blue-600 border border-blue-600 hover:bg-blue-50"
                }`}
            >
              Seleccionar Material de Biblioteca
            </button>
          </div>

          <form
            onSubmit={onSubmit}
            className="space-y-6 p-6 bg-white rounded-lg shadow-lg border border-blue-100"
          >
            {mode === "existing" && (
              <div className="mb-6 pb-6 border-b border-gray-100">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Seleccionar material guardado en tu cuenta
                </label>
                {materials.length === 0 ? (
                  <div className="p-3 bg-yellow-50 text-yellow-700 border border-yellow-100 rounded-md text-sm italic">
                    Todavía no has guardado ningún material en tu biblioteca.
                  </div>
                ) : (
                  <select
                    value={selectedMaterialId}
                    onChange={handleExistingSelection}
                    className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">-- Seleccionar Material --</option>
                    {materials.map((m: any) => (
                      <option key={m.id || m._id} value={m.id || m._id}>
                        {m.name} ({m.espesor}mm, {m.ancho}mm)
                      </option>
                    ))}
                  </select>
                )}
              </div>
            )}

            <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${mode === "existing" && !selectedMaterialId ? "opacity-50 pointer-events-none" : ""}`}>
              {/* Campos Nombre y Descripción para Nuevo Material */}
              {mode === "new" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre del Material
                    </label>
                    <input
                      type="text"
                      name="materialName"
                      value={materialName}
                      onChange={handleChange}
                      placeholder="Ej: Fibra de Carbono T700"
                      className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                      required={mode === "new"}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descripción
                    </label>
                    <textarea
                      name="materialDescription"
                      value={materialDescription}
                      onChange={handleChange}
                      placeholder="Propiedades adicionales..."
                      rows={1}
                      className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Espesor de capa (mm)
                </label>
                <input
                  type="text"
                  name="espesor"
                  value={layerDraft.espesor || ""}
                  onChange={handleChange}
                  placeholder="0.00"
                  className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ancho de la cinta (mm)
                </label>
                <input
                  type="text"
                  name="ancho"
                  value={layerDraft.ancho || ""}
                  onChange={handleChange}
                  placeholder="0.00"
                  className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Coeficiente de rozamiento
                </label>
                <input
                  type="text"
                  name="coeficiente_rozamiento"
                  value={layerDraft.coeficiente_rozamiento || ""}
                  onChange={handleChange}
                  placeholder="0.00"
                  className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                disabled={isSubmitting || isSavingMaterial}
              >
                Volver
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
                disabled={isSavingMaterial}
              >
                {isSavingMaterial ? "Guardando material..." : "Siguiente: Patrón"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
