// src/app/capas/@main/seleccionarPatron/page.tsx

"use client";

import { useCapas } from "../../../capas/CapasContext";
import { useProyecto } from "../../../proyecto/ProyectoContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";

function SeleccionarPatronContent() {
  const { user } = useAuth();
  const {
    isSubmitting,
    layerDraft,
    setLayerDraft,
    handleAddLayer,
    handleUpdateLayer,
    layers,
    fetchLayers,
    generatedPatterns,
    setGeneratedPatterns,
    thumbnails,
    setThumbnails,
    currentNP,
    setCurrentNP,
    calculosIniciales,
    setCalculosIniciales,
    diccionarioCapa,
    setDiccionarioCapa,
    selectedPatternIndex,
    setSelectedPatternIndex,
    handleSeeDetail: handleSeeDetailFromContext
  } = useCapas();

  const {
    selectedProject,
    setSelectedProject,
    projects,
    liners,
    machines,
    materials,
    loading: projectsLoading
  } = useProyecto();

  const router = useRouter();
  const searchParams = useSearchParams();

  const [isGenerating, setIsGenerating] = useState(false);
  // const [generatedPatterns, setGeneratedPatterns] = useState<string[]>([]); // Moved to context
  // const [thumbnails, setThumbnails] = useState<string[]>([]); // Moved to context
  // const [currentNP, setCurrentNP] = useState<number | null>(null); // Moved to context
  // const [calculosIniciales, setCalculosIniciales] = useState<any>(null); // Moved to context
  // const [diccionarioCapa, setDiccionarioCapa] = useState<any>(null); // Moved to context
  // const [selectedPatternIndex, setSelectedPatternIndex] = useState<number | null>(null); // Moved to context

  // Estados para el modal de detalle
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailPlotSvg, setDetailPlotSvg] = useState<string | null>(null);
  const [patternData, setPatternData] = useState<any>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Estado local para selección en dropdowns
  const [selectedLayerId, setSelectedLayerId] = useState<string>("");

  const API_BASE_URL = process.env.NEXT_PUBLIC_URL_BACKEND || "http://localhost:8000";

  useEffect(() => {
    const layerId = searchParams.get("layerId");
    if (layerId) {
      setSelectedLayerId(layerId);
    }
  }, [searchParams]);

  // Sincronizar el proyecto seleccionado con el contexto de Capas
  // para que fetchLayers se ejecute y obtenga las capas correctas
  useEffect(() => {
    if (selectedProject) {
      fetchLayers();
    }
  }, [selectedProject, fetchLayers]);

  const handleGeneratePatterns = async () => {
    if (!selectedProject) {
      alert("Error: No hay proyecto seleccionado");
      return;
    }

    // Validaciones de parámetros críticos
    if (!layerDraft.alfa_original || layerDraft.alfa_original <= 0 || layerDraft.alfa_original >= 90) {
      alert("Error: El ángulo alfa debe estar entre 0° y 90° (exclusivo). Valor actual: " + (layerDraft.alfa_original || 0) + "°");
      return;
    }

    if (!layerDraft.material_name) {
      alert("Error: Debe seleccionar un material en el formulario de creación de capa");
      return;
    }

    const material = materials.find(m => m.name === layerDraft.material_name);
    if (!material || !material.ancho || material.ancho <= 0) {
      alert("Error: El material debe tener un ancho válido (mayor a 0)");
      return;
    }

    if (!material.espesor || material.espesor <= 0) {
      alert("Error: El material debe tener un espesor válido (mayor a 0)");
      return;
    }

    if (!material.coeficiente_rozamiento || material.coeficiente_rozamiento <= 0) {
      alert("Error: El material debe tener un coeficiente de rozamiento válido (mayor a 0)");
      return;
    }

    const liner = liners.find(l => l.name === selectedProject.liner_name);
    if (!liner || !liner.medio || !liner.medio.diametro || liner.medio.diametro <= 0) {
      alert("Error: El liner debe tener un diámetro válido en la sección media (mayor a 0)");
      return;
    }

    setIsGenerating(true);
    try {
      const token = localStorage.getItem("auth_token");

      const machine = machines.find(m => m.name === selectedProject.machine_name);

      const requestBody = {
        project_id: selectedProject.id,
        project_info: {
          user_email: user?.email || "",
          name: selectedProject.name
        },
        liner_id: liner?.id,
        liner_info: liner || null,
        machine_id: machine?.id,
        machine_info: machine || null,
        material_id: material?.id,
        material_info: material || null,
        layer_setup: {
          name: layerDraft.name || "Nueva Capa",
          alfa_original: layerDraft.alfa_original || 0,
          pines: layerDraft.pines || 0,
          corregir_angulo: layerDraft.corregir_angulo || false
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
        setThumbnails(data.thumbnails || []);
        setCurrentNP(data.NP);
        setCalculosIniciales(data.calculos_iniciales);
        setDiccionarioCapa(data.diccionario_capa);
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

  const handleSeeDetail = async (index: number) => {
    setIsDetailLoading(true);
    const result = await handleSeeDetailFromContext(index);
    if (result) {
      setDetailPlotSvg(result.plot_svg);
      setPatternData(result.patternData);
      setShowDetailModal(true);
    }
    setIsDetailLoading(false);
  };

  const handleSelectPattern = (index: number) => {
    setSelectedPatternIndex(index);
    // No actualizamos el draft aquí todavía para evitar inconsistencias si no se guarda.
    // Lo haremos en handleFinalSave.
  };

  const handleFinalSave = async () => {
    if (selectedPatternIndex === null) {
      alert("Por favor, selecciona un patrón");
      return;
    }
    if (!selectedProject) return;

    // Antes de guardar, necesitamos asegurarnos de tener los datos completos del patrón.
    // Si ya abrimos el detalle, los tenemos. Si no, los buscamos.
    let finalPatternData = patternData;
    if (!finalPatternData || finalPatternData.indice !== selectedPatternIndex) {
      const result = await handleSeeDetailFromContext(selectedPatternIndex);
      if (result) {
        finalPatternData = result.patternData;
      }
    }

    const updatedDraft = {
      ...layerDraft,
      patron_elegido: selectedPatternIndex + 1,
      NP: currentNP || 0,
      calculos_iniciales: calculosIniciales,
      patron_elegido_data: finalPatternData
    };

    try {
      if (selectedLayerId) {
        await handleUpdateLayer(selectedLayerId, updatedDraft);
      } else {
        // Actualizamos el draft en el contexto antes de añadir
        setLayerDraft(updatedDraft);
        // Esperamos un tick para que el estado se propague (o pasamos el data directo si handleAddLayer lo soportara)
        // Como handleAddLayer usa el estado interno del contexto, aseguremonos de que se llame con el estado correcto.
        setTimeout(async () => {
          await handleAddLayer();
          router.push("/capas");
        }, 100);
        return;
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
            Configura el proyecto y capa, luego genera los patrones óptimos y selecciona el que mejor se ajuste.
          </p>

          <div className="space-y-6 bg-white-50 p-6 rounded-lg shadow-lg border border-blue-100">

            {/* SECCIÓN 0: Selección de Contexto (Proyecto y Capa) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-blue-50 p-4 rounded-lg border border-blue-100">
              <div>
                <label className="block text-sm font-bold text-blue-900 mb-1">Proyecto</label>
                <select
                  className="w-full p-2 border border-blue-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-blue-950"
                  value={selectedProject?.id || ""}
                  onChange={(e) => {
                    const proj = projects.find(p => p.id === e.target.value);
                    setSelectedProject(proj || null);
                    setSelectedLayerId("");
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
                  className="w-full p-2 border border-blue-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-blue-950"
                  value={selectedLayerId}
                  onChange={(e) => setSelectedLayerId(e.target.value)}
                  disabled={!selectedProject}
                >
                  <option value="">-- Nueva Capa (Crear) --</option>
                  {layers.filter(l => !l.is_system).map(l => (
                    <option key={l.id} value={l.id}>{l.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Paso 1: Generar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-white-50 rounded-lg border border-white-200">
              <div className="flex-1">
                <h3 className="font-semibold text-blue-900">1. Generar Opciones</h3>
                <p className="text-sm text-white-600">
                  {selectedLayerId
                    ? `Calculando patrones para editar: ${layers.find(l => l.id === selectedLayerId)?.name}`
                    : "Calculando patrones para una NUEVA capa basada en el borrador actual."}
                </p>
                {currentNP && (
                  <p className="text-xs font-bold text-blue-600 mt-1">Número de Pasadas (NP) calculado: {currentNP}</p>
                )}
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

            {/* Paso 2: Eliminado de aquí, movido al Aside */}
            {generatedPatterns.length > 0 && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 text-center">
                <p className="text-blue-900 font-semibold">
                  ¡Patrones generados exitosamente!
                </p>
                <p className="text-sm text-blue-700">
                  Por favor, revisa el panel lateral para previsualizar las opciones y seleccionar una.
                </p>
              </div>
            )}

            {/* Paso 3: Confirmar */}
            <div className="pt-6 border-t border-white-100 flex justify-end gap-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 border border-white-300 rounded-md text-white-700 hover:bg-white-50 transition-colors font-bold"
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
                {isSubmitting ? "Guardando..." : (selectedLayerId ? "Actualizar Patrón" : "Seleccionar Patrón")}
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* MODAL DE DETALLE */}
      {showDetailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-blue-950/70 bg-white-50 backdrop-blur-sm">
          <div className="bg-white-50 rounded-2xl shadow-2xl w-[80vw] h-[80vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300">
            {/* Cabecera con fondo blanco sólido */}
            <div className="p-4 border-b border-blue-100 flex justify-between items-center bg-white-50 flex-shrink-0 relative z-10">
              <div className="flex items-center gap-6">
                <h2 className="text-xl font-bold text-blue-950">Vista Detallada del Patrón</h2>

                {/* Controles de Zoom que afectan al SVG */}
                <div className="flex items-center gap-3 bg-blue-50 rounded-xl p-1.5 border border-blue-100 shadow-inner">
                  <button
                    onClick={() => setZoomLevel(prev => Math.max(0.25, prev - 0.25))}
                    className="p-1 px-3 bg-white-50 hover:bg-blue-100 text-blue-600 rounded-lg shadow-sm transition-colors"
                    title="Alejar"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                  </button>
                  <div className="flex flex-col items-center justify-center min-w-[70px]">
                    <span className="text-xs font-black text-blue-900">{(zoomLevel * 100).toFixed(0)}%</span>
                    <span className="text-[8px] text-blue-400 font-bold uppercase tracking-tighter">Zoom</span>
                  </div>
                  <button
                    onClick={() => setZoomLevel(prev => Math.min(8, prev + 0.25))}
                    className="p-1 px-3 bg-white-50 hover:bg-blue-100 text-blue-600 rounded-lg shadow-sm transition-colors"
                    title="Acercar"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 5v14M5 12h14" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setZoomLevel(1)}
                    className="ml-2 p-1 px-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-black shadow-md transition-all active:scale-95"
                    title="Restablecer vista"
                  >
                    100%
                  </button>
                </div>
              </div>

              <button
                onClick={() => {
                  setShowDetailModal(false);
                  setZoomLevel(1);
                }}
                className="p-2 hover:bg-red-50 hover:text-red-600 rounded-full text-blue-900 transition-all duration-200"
              >
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Cuerpo del modal con scroll 2D para el zoom */}
            <div className="flex-1 overflow-auto bg-blue-50/30 p-4 lg:p-10 custom-scrollbar flex flex-col items-center">
              {detailPlotSvg ? (
                <div
                  className="bg-white-50 shadow-2xl rounded-xl border border-blue-100 transition-all duration-300 ease-out flex-shrink-0"
                  style={{
                    width: `${zoomLevel * 100}%`,
                    minWidth: '600px',
                    maxWidth: zoomLevel > 1 ? 'none' : '100%'
                  }}
                  dangerouslySetInnerHTML={{ __html: detailPlotSvg }}
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-20 gap-4">
                  <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                  <p className="text-blue-900 font-bold">Generando previsualización técnica...</p>
                </div>
              )}

              {patternData && (
                <div className="py-8 w-full grid grid-cols-2 md:grid-cols-4 gap-4 flex-shrink-0">
                  <div className="bg-white-50 p-4 rounded-xl border border-blue-100 shadow-sm group hover:border-blue-300 transition-colors">
                    <span className="block text-[10px] text-blue-400 font-black uppercase tracking-widest mb-1">NP Pasadas</span>
                    <span className="text-2xl font-black text-blue-950">{patternData.NP}</span>
                  </div>
                  <div className="bg-white-50 p-4 rounded-xl border border-blue-100 shadow-sm group hover:border-blue-300 transition-colors">
                    <span className="block text-[10px] text-blue-400 font-black uppercase tracking-widest mb-1">Paso (b)</span>
                    <span className="text-2xl font-black text-blue-950">{patternData.b}</span>
                  </div>
                  <div className="bg-white-50 p-4 rounded-xl border border-blue-100 shadow-sm group hover:border-blue-300 transition-colors">
                    <span className="block text-[10px] text-blue-400 font-black uppercase tracking-widest mb-1">Parámetro Ptr</span>
                    <span className="text-2xl font-black text-blue-950">{patternData.PTR}</span>
                  </div>
                  <div className="bg-white-50 p-4 rounded-xl border border-blue-100 shadow-sm group hover:border-blue-300 transition-colors">
                    <span className="block text-[10px] text-blue-400 font-black uppercase tracking-widest mb-1">Dcco Coeficiente</span>
                    <span className="text-2xl font-black text-blue-950">{patternData.Dcco?.toFixed(6)}</span>
                  </div>
                </div>
              )}

              {/* Botones de acción fijos en la parte inferior */}
              <div className="mt-auto pt-8 border-t border-blue-100 flex justify-end gap-4 w-full pb-6 flex-shrink-0 bg-white-50 sticky bottom-0 z-10 px-6">
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    setZoomLevel(1);
                  }}
                  className="px-8 py-3 border-2 border-blue-100 rounded-xl text-blue-900 hover:bg-blue-50 hover:border-blue-200 font-bold transition-all active:scale-95"
                >
                  Cerrar
                </button>
                <button
                  onClick={() => {
                    setSelectedPatternIndex(patternData.indice);
                    setShowDetailModal(false);
                    setZoomLevel(1);
                  }}
                  className="px-10 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95 flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Seleccionar este patrón
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Indicador de carga para detalle */}
      {isDetailLoading && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-blue-900/20 backdrop-blur-[2px]">
          <div className="bg-white-50 p-6 rounded-2xl shadow-xl flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-100 border-t-blue-600"></div>
            <p className="text-blue-900 font-bold">Generando vista detallada...</p>
          </div>
        </div>
      )}
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
