// src/app/capas/@main/material/page.tsx

"use client";

import React, { useState } from "react";
import { useCapas } from "../../../capas/CapasContext";
import { useProyecto } from "../../../proyecto/ProyectoContext";
import { useRouter } from "next/navigation";
import { handleNumericChangeValidation } from "@/utils/validation";
import { getCurrentLocation } from "@/utils/geolocation";

export default function MaterialCapaPage() {
  const { isSubmitting, layerDraft, setLayerDraft } = useCapas();
  const { materials, fetchMaterials } = useProyecto();
  const router = useRouter();

  const [mode, setMode] = useState<"existing" | "new" | "editing">("new");
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>("");
  const [isSavingMaterial, setIsSavingMaterial] = useState(false);

  // Estados locales para Nombre y Descripción si se crea nuevo o edita
  const [materialName, setMaterialName] = useState("");
  const [materialDescription, setMaterialDescription] = useState("");

  const API_BASE_URL = process.env.NEXT_PUBLIC_URL_BACKEND || "http://localhost:8000";

  const onValidationError = (msg: string) => {
    alert(msg);
  };

  // Estados locales para los inputs numéricos para permitir escritura de decimales
  const [localEspesor, setLocalEspesor] = useState("");
  const [localAncho, setLocalAncho] = useState("");
  const [localCoeficiente, setLocalCoeficiente] = useState("");

  // Sincronizar estado local con el draft cuando cambia el draft (ej. al seleccionar material)
  React.useEffect(() => {
    setLocalEspesor(layerDraft.espesor?.toString() || "");
    setLocalAncho(layerDraft.ancho?.toString() || "");
    setLocalCoeficiente(layerDraft.coeficiente_rozamiento?.toString() || "");
  }, [layerDraft.espesor, layerDraft.ancho, layerDraft.coeficiente_rozamiento, selectedMaterialId, mode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === "materialName") {
      setMaterialName(value);
      return;
    }
    if (name === "materialDescription") {
      setMaterialDescription(value);
      return;
    }

    // Validación de coma
    handleNumericChangeValidation(e, onValidationError);

    // Actualizar estado local inmediatamente para la UI
    if (name === "espesor") setLocalEspesor(value);
    if (name === "ancho") setLocalAncho(value);
    if (name === "coeficiente_rozamiento") setLocalCoeficiente(value);

    // Actualizar el draft solo si es un número válido
    // Permitir vacío para borrado
    const floatVal = parseFloat(value);
    setLayerDraft(prev => ({
      ...prev,
      [name]: isNaN(floatVal) ? 0 : floatVal
    }));
  };

  const handleModeChange = (newMode: "existing" | "new" | "editing") => {
    setMode(newMode);
    if (newMode === "new") {
      setSelectedMaterialId("");
      setMaterialName("");
      setMaterialDescription("");
      // Resetear valores visuales del draft si se quiere empezar de cero?
      // O mantenerlos. Mejor limpiar para "Nuevo"
      setLayerDraft(prev => ({
        ...prev,
        espesor: 0,
        ancho: 0,
        coeficiente_rozamiento: 0
      }));
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

  const handleEditClick = () => {
    if (!selectedMaterialId) return;
    const sourceMaterial = materials.find((m: any) => m.id === selectedMaterialId || m._id === selectedMaterialId);
    if (sourceMaterial) {
      setMaterialName(sourceMaterial.name);
      setMaterialDescription(sourceMaterial.description || "");
      setMode("editing");
      // Los valores numéricos ya están en layerDraft por la selección previa
    }
  };

  const handleDeleteClick = async () => {
    if (!selectedMaterialId) return;
    if (!confirm("¿Estás seguro de que deseas eliminar este material? Esta acción no se puede deshacer.")) return;

    try {
      setIsSavingMaterial(true);
      const token = localStorage.getItem("auth_token");
      if (!token) throw new Error("No hay sesión activa");

      const response = await fetch(`${API_BASE_URL}/materials/${selectedMaterialId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        },
      });

      if (response.ok) {
        await fetchMaterials();
        setSelectedMaterialId("");
        setMode("existing");
        // Limpiar draft
        setLayerDraft(prev => ({
          ...prev,
          espesor: 0,
          ancho: 0,
          coeficiente_rozamiento: 0
        }));
        alert("Material eliminado correctamente");
      } else {
        alert("Error al eliminar material");
      }
    } catch (err) {
      console.error("Error deleting material:", err);
      alert("Error al eliminar material");
    } finally {
      setIsSavingMaterial(false);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Actualizar el draft con el nombre y descripción seleccionados/ingresados
    if (mode === "new" || mode === "editing") {
      setLayerDraft(prev => ({ ...prev, name: materialName, description: materialDescription }));
    }

    if (mode === "new" || mode === "editing") {
      try {
        setIsSavingMaterial(true);
        const token = localStorage.getItem("auth_token");
        if (!token) throw new Error("No hay sesión activa");

        const location = await getCurrentLocation();
        const materialData = {
          name: materialName || `Material ${new Date().toLocaleDateString()}`,
          description: materialDescription,
          espesor: layerDraft.espesor,
          ancho: layerDraft.ancho,
          coeficiente_rozamiento: layerDraft.coeficiente_rozamiento,
          location
        };

        let response;
        if (mode === "editing") {
          response = await fetch(`${API_BASE_URL}/materials/${selectedMaterialId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(materialData),
          });
        } else {
          response = await fetch(`${API_BASE_URL}/materials/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(materialData),
          });
        }

        if (response.ok) {
          const savedMaterial = await response.json();
          await fetchMaterials(); // Recargar biblioteca global

          if (mode === "editing") {
            setMode("existing");
            // Asegurar que el ID seleccionado sigue siendo válido (o se actualiza si cambió algo crítico)
            // Aunque el ID no debería cambiar en un update.
            setSelectedMaterialId(savedMaterial.id || savedMaterial._id);
            alert("Material actualizado correctamente");
            return; // Quedarse en la pantalla para verificar o seguir eligiendo
          } else {
            // Si es nuevo, auto-seleccionar el recién creado para que el usuario pueda avanzar
            setMode("existing");
            setSelectedMaterialId(savedMaterial.id || savedMaterial._id);
            // Permitir avanzar automáticamente al siguiente paso en modo "create and use"?
            // Por consistencia, vamos al siguiente paso directamente solo si era "Create New"
            // Pero el flujo original era crear -> siguiente.
            // Mantengamos el comportamiento original para "new": crear y avanzar.
            router.push("/capas/seleccionarPatron");
            return;
          }
        }
      } catch (err) {
        console.error("Error saving material to library:", err);
        alert("Error al guardar material");
        return; // Detener navegación si error
      } finally {
        setIsSavingMaterial(false);
      }
    } else if (mode === "existing") {
      // Solo avanzar si hay selección
      if (!selectedMaterialId) {
        alert("Por favor selecciona un material");
        return;
      }
      router.push("/capas/seleccionarPatron");
    }
  };

  const onCancel = () => {
    if (mode === "editing") {
      setMode("existing");
      // Resetear a los valores originales del material seleccionado
      if (selectedMaterialId) {
        const m = materials.find((mat: any) => mat.id === selectedMaterialId || mat._id === selectedMaterialId);
        if (m) {
          setLayerDraft(prev => ({
            ...prev,
            espesor: m.espesor,
            ancho: m.ancho,
            coeficiente_rozamiento: m.coeficiente_rozamiento
          }));
        }
      }
    } else {
      router.back();
    }
  };

  return (
    <div className="flex-1 overflow-y-auto col-[1/13] lg:grid lg:grid-rows-[repeat(17,1fr)] h-full">
      <div className="row-[1/18] lg:col-[1/13] p-4 text-white-500">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-blue-950 mb-4">
            {mode === "editing" ? "Editar Material Existente" : "Definir Material de la Capa"}
          </h1>

          {mode !== "editing" && (
            <div className="mb-6 flex space-x-4">
              <button
                onClick={() => handleModeChange("new")}
                type="button"
                className={`px-4 py-2 rounded-md font-semibold transition-colors ${mode === "new"
                  ? "bg-blue-600 text-white-50 shadow-md"
                  : "bg-white text-blue-600 border border-blue-600 hover:bg-blue-50"
                  }`}
              >
                Crear Nuevo Material
              </button>
              <button
                onClick={() => handleModeChange("existing")}
                type="button"
                className={`px-4 py-2 rounded-md font-semibold transition-colors ${mode === "existing"
                  ? "bg-blue-600 text-white-50 shadow-md"
                  : "bg-white text-blue-600 border border-blue-600 hover:bg-blue-50"
                  }`}
              >
                Seleccionar Material de Biblioteca
              </button>
            </div>
          )}

          <form
            onSubmit={onSubmit}
            className="space-y-6 p-6 bg-white rounded-lg shadow-lg border border-blue-100"
          >
            {mode === "existing" && (
              <div className="mb-6 pb-6 border-b border-white-100">
                <label className="block text-sm font-medium text-white-700 mb-2">
                  Seleccionar material guardado en tu cuenta
                </label>
                {materials.length === 0 ? (
                  <div className="p-3 bg-yellow-50 text-yellow-700 border border-yellow-100 rounded-md text-sm italic">
                    Todavía no has guardado ningún material en tu biblioteca.
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <select
                      value={selectedMaterialId}
                      onChange={handleExistingSelection}
                      className="flex-1 px-3 py-2 text-white-700 border border-white-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="">-- Seleccionar Material --</option>
                      {materials.map((m: any) => (
                        <option key={m.id || m._id} value={m.id || m._id}>
                          {m.name} ({m.espesor}mm, {m.ancho}mm)
                        </option>
                      ))}
                    </select>

                    {selectedMaterialId && (
                      <>
                        <button
                          type="button"
                          onClick={handleEditClick}
                          className="px-3 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                          title="Editar Material"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={handleDeleteClick}
                          className="px-3 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                          title="Eliminar Material"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${mode === "existing" && !selectedMaterialId ? "opacity-50 pointer-events-none" : ""}`}>
              {/* Campos Nombre y Descripción para Nuevo Material o Edición */}
              {(mode === "new" || mode === "editing") && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-white-700 mb-1">
                      Nombre del Material
                    </label>
                    <input
                      type="text"
                      name="materialName"
                      value={materialName}
                      onChange={handleChange}
                      placeholder="Ej: Fibra de Carbono T700"
                      className="w-full px-3 py-2 text-white-700 border border-white-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white-50"
                      required={mode === "new" || mode === "editing"}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white-700 mb-1">
                      Descripción
                    </label>
                    <textarea
                      name="materialDescription"
                      value={materialDescription}
                      onChange={handleChange}
                      placeholder="Propiedades adicionales..."
                      rows={1}
                      className="w-full px-3 py-2 text-white-700 border border-white-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white-50"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-white-700 mb-1">
                  Espesor de capa (mm)
                </label>
                <input
                  type="text"
                  name="espesor"
                  value={localEspesor}
                  onChange={handleChange}
                  placeholder="0.00"
                  className={`w-full px-3 py-2 text-white-700 border border-white-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none ${mode === "existing" ? "bg-white-200" : "bg-white-50"}`}
                  required
                  readOnly={mode === "existing"} // ReadOnly si solo seleccionamos
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white-700 mb-1">
                  Ancho de la cinta (mm)
                </label>
                <input
                  type="text"
                  name="ancho"
                  value={localAncho}
                  onChange={handleChange}
                  placeholder="0.00"
                  className={`w-full px-3 py-2 text-white-700 border border-white-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none ${mode === "existing" ? "bg-white-200" : "bg-white-50"}`}
                  required
                  readOnly={mode === "existing"}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white-700 mb-1">
                  Coeficiente de rozamiento
                </label>
                <input
                  type="text"
                  name="coeficiente_rozamiento"
                  value={localCoeficiente}
                  onChange={handleChange}
                  placeholder="0.00"
                  className={`w-full px-3 py-2 text-white-700 border border-white-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none ${mode === "existing" ? "bg-white-200" : "bg-white-50"}`}
                  required
                  readOnly={mode === "existing"}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-4 border-t border-white-100">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 border border-white-300 rounded-md text-white-700 hover:bg-white-50 transition-colors"
                disabled={isSubmitting || isSavingMaterial}
              >
                {mode === "editing" ? "Cancelar Edición" : "Volver"}
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white-50 font-semibold rounded-md hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
                disabled={isSavingMaterial || (mode === "existing" && !selectedMaterialId)}
              >
                {isSavingMaterial
                  ? "Guardando..."
                  : mode === "editing"
                    ? "Actualizar Material"
                    : mode === "new"
                      ? "Crear y Usar"
                      : "Usar Material Seleccionado"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
