"use client";

import React, { useState, useEffect } from "react";
import { useProyecto } from "../../ProyectoContext";
import { motion, AnimatePresence } from "framer-motion";
import { FiCpu, FiPlay, FiAlertCircle, FiLayers, FiSettings, FiCheckCircle, FiDownload, FiMail } from "react-icons/fi";

export default function GCodePage() {
  const {
    projects,
    selectedProject,
    setSelectedProject,
    gcodeData,
    setGcodeData,
    isCalculatingGCode,
    setIsCalculatingGCode
  } = useProyecto();

  const [localError, setLocalError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const API_BASE_URL = process.env.NEXT_PUBLIC_URL_BACKEND || "http://localhost:8000";

  // Ordenar proyectos de más nuevo a más antiguo por fecha de modificación
  const sortedProjects = [...projects].sort((a, b) =>
    new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  );

  const isReady = selectedProject?.completion_percentage === 100;

  const handleCalcularGCode = async () => {
    if (!selectedProject) {
      setLocalError("Por favor, selecciona un proyecto primero.");
      return;
    }

    try {
      setIsCalculatingGCode(true);
      setLocalError(null);
      setGcodeData(null);

      const token = localStorage.getItem("auth_token");
      const response = await fetch(`${API_BASE_URL}/calculations/gcode`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ project_id: selectedProject.id }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || "Error al generar el código G");
      }

      const data = await response.json();
      setGcodeData(data.gcode_files);
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setIsCalculatingGCode(false);
    }
  };

  const handleSaveTxt = () => {
    if (!gcodeData) return;
    // Usamos el archivo 'Total' por defecto o el primero disponible
    const fileName = gcodeData["Total"] ? "Total" : Object.keys(gcodeData)[0];
    if (!fileName) return;

    const text = gcodeData[fileName].join("\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSendEmail = () => {
    if (!gcodeData) return;
    const fileName = gcodeData["Total"] ? "Total" : Object.keys(gcodeData)[0];
    if (!fileName) return;

    const text = gcodeData[fileName].join("\n");
    const subject = encodeURIComponent(`Código G: ${selectedProject?.name} - ${fileName}`);
    const body = encodeURIComponent(text);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <div className="flex-1 overflow-y-auto col-[1/13] lg:grid lg:grid-rows-[repeat(17,1fr)] h-full bg-blue-50/50">
      <div className="row-[1/18] lg:col-[1/13] p-6 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto w-full"
        >
          {/* Header Section */}
          <div className="flex items-center space-x-4 mb-8">
            <div className="p-3 bg-blue-600 rounded-2xl shadow-lg ring-4 ring-blue-100">
              <FiCpu className="text-white text-3xl" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-blue-950 tracking-tight">Generación de Código G</h1>
              <p className="text-blue-600 font-medium">Procesamiento de capas y trayectorias CNC</p>
            </div>
          </div>

          {/* Configuration Card */}
          <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-2xl shadow-blue-200/50 border border-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Project Selection */}
              <div className="space-y-4">
                <label className="flex items-center space-x-2 text-sm font-bold text-blue-900 uppercase tracking-wider">
                  <FiLayers className="text-blue-500" />
                  <span>Seleccionar Proyecto</span>
                </label>
                <div className="relative group">
                  <select
                    className="w-full bg-blue-50/50 border-2 border-blue-100 rounded-2xl px-5 py-4 text-blue-950 font-semibold focus:outline-none focus:border-blue-500 transition-all appearance-none cursor-pointer group-hover:bg-white"
                    value={selectedProject?.id || ""}
                    onChange={(e) => {
                      const project = projects.find(p => p.id === e.target.value);
                      setSelectedProject(project || null);
                    }}
                    suppressHydrationWarning
                  >
                    <option value="" disabled>Elige un proyecto...</option>
                    {sortedProjects.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-blue-400">
                    <motion.div animate={{ y: [0, 2, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
                      ▼
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Project Info Summary */}
              <div className="bg-blue-900/5 rounded-3xl p-6 border border-blue-100/50">
                <label className="flex items-center space-x-2 text-xs font-bold text-blue-400 uppercase tracking-widest mb-4">
                  <FiSettings />
                  <span>Estado del Proyecto</span>
                </label>
                {selectedProject ? (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center bg-white/60 p-3 rounded-xl">
                      <span className="text-sm font-medium text-blue-700">Progreso:</span>
                      <span className={`text-sm font-bold ${isReady ? 'text-green-600' : 'text-blue-950'}`}>
                        {selectedProject.completion_percentage}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center bg-white/60 p-3 rounded-xl">
                      <span className="text-sm font-medium text-blue-700">Actualizado:</span>
                      <span className="text-sm font-bold text-blue-950">
                        {mounted ? new Date(selectedProject.updated_at).toLocaleDateString() : '...'}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-blue-300 italic text-sm py-8">
                    No hay proyecto seleccionado
                  </div>
                )}
              </div>
            </div>

            {!isReady && selectedProject && (
              <div className="mt-6 p-4 bg-blue-100/50 border border-blue-200 rounded-2xl flex items-center space-x-3 text-blue-900 text-sm font-medium">
                <FiAlertCircle className="text-blue-600 flex-shrink-0" />
                <span>Para generar el código G, el proyecto debe alcanzar el 100% de progreso.</span>
              </div>
            )}

            {/* Action Area */}
            <div className="mt-12 space-y-4 pt-8 border-t border-blue-100">
              <AnimatePresence mode="wait">
                {localError && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-xl flex items-center space-x-3 text-red-700 font-medium"
                  >
                    <FiAlertCircle className="flex-shrink-0" />
                    <span>{localError}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Main Action: Generate */}
              <button
                onClick={handleCalcularGCode}
                disabled={isCalculatingGCode || !isReady}
                suppressHydrationWarning
                className={`
                w-full group relative overflow-hidden py-5 rounded-2xl font-bold text-xl transition-all shadow-xl
                ${isCalculatingGCode || !isReady
                    ? "bg-blue-200 text-blue-400 cursor-not-allowed border border-blue-300"
                    : "bg-blue-950 text-white hover:bg-blue-900 shadow-blue-900/20 active:scale-[0.98]"
                  }
              `}
              >
                <div className="relative flex items-center justify-center space-x-3 z-10">
                  {isCalculatingGCode ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full"
                      />
                      <span>Generando trayectorias...</span>
                    </>
                  ) : (
                    <>
                      <FiPlay className="text-2xl" />
                      <span>Generar codigo G</span>
                    </>
                  )}
                </div>
              </button>

              {/* Secondary Actions: Save and Send */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={handleSaveTxt}
                  disabled={!gcodeData || isCalculatingGCode}
                  suppressHydrationWarning
                  className={`
                  flex items-center justify-center space-x-2 py-4 rounded-2xl font-bold text-lg transition-all shadow-md
                  ${gcodeData
                      ? "bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98]"
                      : "bg-white text-blue-600 border-2 border-blue-600 opacity-60 cursor-not-allowed"
                    }
                `}
                >
                  <FiDownload />
                  <span>Guardar codigo G</span>
                </button>

                <button
                  onClick={handleSendEmail}
                  disabled={!gcodeData || isCalculatingGCode}
                  suppressHydrationWarning
                  className={`
                  flex items-center justify-center space-x-2 py-4 rounded-2xl font-bold text-lg transition-all shadow-md
                  ${gcodeData
                      ? "bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98]"
                      : "bg-white text-blue-600 border-2 border-blue-600 opacity-60 cursor-not-allowed"
                    }
                `}
                >
                  <FiMail />
                  <span>Enviar codigo G</span>
                </button>
              </div>
            </div>
          </div>

          {/* Status Guide */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Precisión CNC", desc: "Cálculos exactos basados en radio y ángulo", color: "blue" },
              { title: "Multi-Capa", desc: "Generación secuencial para todo el proyecto", color: "indigo" },
              { title: "Validado", desc: "Trayectorias verificadas contra límites físicos", color: "cyan" }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * i }}
                className="bg-white/50 backdrop-blur-sm rounded-3xl p-6 border border-white hover:bg-white transition-colors"
              >
                <h3 className={`font-bold text-blue-950 mb-1 flex items-center space-x-2`}>
                  <FiCheckCircle className={`text-blue-500`} />
                  <span>{item.title}</span>
                </h3>
                <p className="text-xs text-blue-600/70 font-medium leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Loading Overlay */}
      <AnimatePresence>
        {isCalculatingGCode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[100] bg-blue-950/40 backdrop-blur-[3px] flex items-center justify-center"
          >
            <div className="bg-white p-8 rounded-[2rem] shadow-2xl flex flex-col items-center space-y-4 border border-blue-100">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full"
              />
              <div className="text-center">
                <h3 className="text-xl font-bold text-blue-950">Generando Código G</h3>
                <p className="text-blue-600 font-medium whitespace-nowrap">Esto puede tardar unos segundos...</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
