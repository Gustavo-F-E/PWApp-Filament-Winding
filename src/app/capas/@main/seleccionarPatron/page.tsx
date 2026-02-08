// src/app/capas/@main/seleccionarPatron/page.tsx

"use client";

import { useCapas } from "../../../capas/CapasContext";
import { useProyecto } from "../../../proyecto/ProyectoContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";

function SeleccionarPatronContent() {
  const {
    isSubmitting,
    layerDraft,
    setLayerDraft,
    handleAddLayer,
    handleUpdateLayer,
    layers, // Acceso a capas del contexto
    fetchLayers, // Para refrescar capas si cambia proyecto
    setEditingLayer
  } = useCapas();

  const {
    selectedProject,
    setSelectedProject,
    projects, // Lista de proyectos para el dropdown
    loading: projectsLoading
  } = useProyecto();

  const router = useRouter();
  const searchParams = useSearchParams();

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPatterns, setGeneratedPatterns] = useState<string[]>([]);
  const [selectedPatternIndex, setSelectedPatternIndex] = useState<number | null>(null);

  // Estado local para selección en dropdowns
  const [selectedLayerId, setSelectedLayerId] = useState<string>("");

  const API_BASE_URL = process.env.NEXT_PUBLIC_URL_BACKEND || "http://localhost:8000";

  // 1. Cargar parámetros de URL al iniciar
  useEffect(() => {
    const projectIdParam = searchParams.get("projectId");
    const layerIdParam = searchParams.get("layerId");

    if (projectIdParam && projects.length > 0) {
      const proj = projects.find(p => p.id === projectIdParam);
      if (proj && (!selectedProject || selectedProject.id !== proj.id)) {
        setSelectedProject(proj);
      }
    }

    if (layerIdParam) {
      setSelectedLayerId(layerIdParam);
    }
  }, [searchParams, projects, setSelectedProject, selectedProject]);

  // 2. Sincronizar layerDraft con la capa seleccionada (Modo Edición)
  useEffect(() => {
    if (selectedLayerId && layers.length > 0) {
      const layerToEdit = layers.find(l => l.id === selectedLayerId || l._id === selectedLayerId);
      if (layerToEdit) {
        setEditingLayer(layerToEdit);
        setLayerDraft(layerToEdit);
        // Resetear patrones si cambiamos de capa
        setGeneratedPatterns([]);
        setSelectedPatternIndex(null);
      }
    } else if (!selectedLayerId) {
      // Modo Creación: Mantener draft actual o resetear si se desea
      // setEditingLayer(null);
    }
  }, [selectedLayerId, layers, setEditingLayer, setLayerDraft]);


  const handleGeneratePatterns = async () => {
    if (!selectedProject) {
      alert("Error: No hay proyecto seleccionado");
      return;
    }

    setIsGenerating(true);
    try {
      const token = localStorage.getItem("auth_token");

      const requestBody = {
        project_id: selectedProject.id || selectedProject._id,
        liner_id: selectedProject.liner_name,
        machine_id: selectedProject.machine_name,
        material_id: "material-temp-id",
        layer_setup: {
          ...layerDraft,
          name: layerDraft.name || "Nueva Capa",
          is_system: false,
          system_vueltas: 0
        }
      };

      const response = await fetch(`${API_BASE_URL}/calculations/patterns`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      });

      if (response.ok) {
        const data = await response.json();
        setGeneratedPatterns(data.patterns || []);
        setSelectedPatternIndex(null);
      } else {
        const err = await response.json();
        alert(`Error al generar patrones: ${err.detail || "Error desconocido"}`);
      }
    } catch (error) {
      console.error("Error generating patterns:", error);
      alert("Error de conexión al generar patrones");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectPattern = (pattern: string, index: number) => {
    setSelectedPatternIndex(index);
    // Simulación: Parsear el string del patrón para obtener NP real si fuera necesario.
    // Por ahora asumimos que el backend devuelve strings descriptivos.
    // Actualizamos el draft con la selección.
    setLayerDraft(prev => ({
      ...prev,
      patron_elegido: index + 1, // Asumimos ID basado en índice 1-based por ahora
      NP: 10 // Mock, debería venir del backend
    }));
  };

  const handleFinalSave = async () => {
    if (selectedPatternIndex === null) return;
    if (!selectedProject) return;

    try {
      if (selectedLayerId) {
        // MODO EDICIÓN: Actualizar capa existente
        await handleUpdateLayer(selectedLayerId, layerDraft);
        alert("Patrón actualizado exitosamente");
      } else {
        // MODO CREACIÓN: Crear nueva capa
        await handleAddLayer();
        // handleAddLayer ya muestra alert de éxito
      }
      router.push("/capas");
    } catch (error) {
      console.error("Error saving layer:", error);
      alert("Error al guardar la capa");
    }
  };

  return (
    <div className="flex-1 overflow-y-auto col-[1/13] lg:grid lg:grid-rows-[repeat(17,1fr)] h-full">
      <div className="row-[1/18] lg:col-[1/13] p-4 text-white-500">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-blue-950 mb-2">
            Seleccionar Patrón de Bobinado
          </h1>
          <p className="text-white-600 mb-6">
            Configura el proyecto y capa, luego genera los patrones óptimos.
          </p>

          <div className="space-y-6 bg-white p-6 rounded-lg shadow-lg border border-blue-100">

            {/* SECCIÓN 0: Selección de Contexto (Proyecto y Capa) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-blue-50 p-4 rounded-lg border border-blue-100">
              <div>
                <label className="block text-sm font-bold text-blue-900 mb-1">Proyecto</label>
                <select
                  className="w-full p-2 border border-blue-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedProject?.id || ""}
                  onChange={(e) => {
                    const proj = projects.find(p => p.id === e.target.value);
                    setSelectedProject(proj || null);
                    setSelectedLayerId(""); // Reset capa al cambiar proyecto
                  }}
                  disabled={projectsLoading}
                >
                  <option value="">-- Seleccionar Proyecto --</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-blue-900 mb-1">Capa (Opcional - Para Editar)</label>
                <select
                  className="w-full p-2 border border-blue-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedLayerId}
                  onChange={(e) => setSelectedLayerId(e.target.value)}
                  disabled={!selectedProject}
                >
                  <option value="">-- Nueva Capa (Crear) --</option>
                  {layers.filter(l => !l.is_system).map(l => (
                    <option key={l.id || l._id} value={l.id || l._id}>{l.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Paso 1: Generar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-white-50 rounded-lg border border-white-200">
              <div>
                <h3 className="font-semibold text-blue-900">1. Generar Opciones</h3>
                <p className="text-sm text-white-600">
                  {selectedLayerId
                    ? `Calculando patrones para editar: ${layers.find(l => l.id === selectedLayerId || l._id === selectedLayerId)?.name}`
                    : "Calculando patrones para una NUEVA capa basada en el borrador actual."}
                </p>
              </div>
              <button
                type="button"
                onClick={handleGeneratePatterns}
                disabled={isGenerating || !selectedProject}
                className="px-6 py-2 bg-blue-600 text-white-50 font-semibold rounded-md hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {isGenerating ? "Calculando..." : "Generar Patrones"}
              </button>
            </div>

            {/* Paso 2: Lista de Patrones */}
            {generatedPatterns.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-semibold text-blue-900 border-b border-white-100 pb-2">2. Patrones Disponibles</h3>
                <div className="grid grid-cols-1 gap-3">
                  {generatedPatterns.map((patron, index) => (
                    <div
                      key={index}
                      onClick={() => handleSelectPattern(patron, index)}
                      className={`
                                    p-4 rounded-lg border-2 cursor-pointer transition-all flex items-center justify-between
                                    ${selectedPatternIndex === index
                          ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
                          : "border-white-200 hover:border-blue-300 hover:bg-white-50"}
                                `}
                    >
                      <span className={`font-medium ${selectedPatternIndex === index ? "text-blue-800" : "text-white-700"}`}>
                        {patron}
                      </span>
                      {selectedPatternIndex === index && (
                        <span className="text-blue-600 font-bold">✓ Seleccionado</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Paso 3: Confirmar */}
            <div className="pt-6 border-t border-white-100 flex justify-end gap-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 border border-white-300 rounded-md text-white-700 hover:bg-white-50 transition-colors"
                disabled={isSubmitting}
              >
                Volver
              </button>
              <button
                type="button"
                onClick={handleFinalSave}
                disabled={selectedPatternIndex === null || isSubmitting}
                className="px-8 py-2 bg-blue-600 text-white-50 font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Guardando..." : (selectedLayerId ? "Actualizar Patrón" : "Crear Capa con Patrón")}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default function SeleccionarPatronPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Cargando selector de patrones...</div>}>
      <SeleccionarPatronContent />
    </Suspense>
  );
}
