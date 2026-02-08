//src\app\capas\@main\page.tsx

"use client";

import React, { useState, useEffect } from "react";
import { useCapas } from "../CapasContext";
import { useProyecto } from "../../proyecto/ProyectoContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function CapasDashboard() {
  const {
    projects,
    liners,
    selectedProject,
    setSelectedProject,
    loading
  } = useProyecto();
  const {
    handleDeleteLayer,
    handleReorderLayer,
    handleBulkReorder,
    setEditingLayer,
    toggleAside,
    isAsideOpen,
    isEditingOrder,
    setIsEditingOrder,
    layers: contextLayers
  } = useCapas();

  const [localLayers, setLocalLayers] = useState<any[]>([]);

  useEffect(() => {
    setLocalLayers(contextLayers);
  }, [contextLayers]);
  const { isLogged } = useAuth();
  const router = useRouter();

  if (!isLogged) {
    return (
      <div className="flex-1 overflow-y-auto col-[1/13] lg:grid lg:grid-cols-12 h-full">
        <div className="lg:col-span-12 p-4">
          <section className="mb-8 p-6 bg-white-50 rounded-xl shadow-md border border-blue-50">
            <h1 className="text-2xl font-bold text-blue-950 mb-4 text-center">Gestión de Capas</h1>
            <p className="text-white-600 text-center font-medium">Por favor, inicie sesión para gestionar las capas de sus proyectos.</p>
          </section>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex-1 overflow-y-auto col-[1/13] lg:grid lg:grid-cols-12 h-full">
        <div className="lg:col-span-12 p-4">
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  const projectLiner = selectedProject ? liners.find(l => l.name === selectedProject.liner_name) : null;

  return (
    <div className="flex-1 overflow-y-auto col-[1/13] lg:grid lg:grid-cols-12 h-full bg-blue-50">
      <div className="lg:col-span-12 p-6 space-y-8 pb-6">

        {/* Selector de Proyecto */}
        <section className="bg-white-50 p-6 rounded-xl shadow-md border border-blue-100">
          <label className="block text-sm font-bold text-blue-900 mb-2">Seleccionar Proyecto</label>
          <select
            className="w-full lg:w-1/2 p-2.5 border border-blue-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50 text-blue-950 font-medium transition-all"
            value={selectedProject?.id || ""}
            onChange={(e) => {
              const proj = projects.find(p => p.id === e.target.value);
              setSelectedProject(proj || null);
            }}
          >
            <option value="">-- Elige un proyecto --</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </section>

        {!selectedProject ? (
          <div className="bg-white rounded-xl shadow-md p-10 border border-blue-100 text-center">
            <h2 className="text-xl font-bold text-blue-950 mb-2">Sin selección</h2>
            <p className="text-white-500 italic">Por favor, selecciona un proyecto para ver sus capas.</p>
          </div>
        ) : (
          <>
            {/* Resumen del Proyecto */}
            <section className="bg-white-50 p-6 rounded-xl shadow-md border border-blue-100 animate-fadeIn">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-blue-950">Resumen del Proyecto</h2>
                <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                  {selectedProject.completion_percentage}%
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-bold text-blue-800">Nombre</p>
                  <p className="text-white-700">{selectedProject.name}</p>
                </div>
                <div>
                  <p className="text-sm font-bold text-blue-800">Descripción</p>
                  <p className="text-white-700">{selectedProject.description || "Sin descripción"}</p>
                </div>
              </div>
            </section>

            {/* Resumen del Liner */}
            <section className="bg-white-50 p-6 rounded-xl shadow-sm border border-blue-200 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
              <h2 className="text-lg font-bold text-blue-900 mb-4">Detalles del Liner</h2>
              {projectLiner ? (
                <div className="flex flex-wrap gap-8">
                  <div>
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Nombre</span>
                    <p className="font-semibold text-blue-950">{projectLiner.name}</p>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Tipo mandril</span>
                    <p className="font-semibold text-blue-950 capitalize">{projectLiner.tipo_liner}</p>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Extremo Inicial</span>
                    <p className="font-semibold text-blue-950">{projectLiner.extremo_inicial?.tipo || "Ninguno"}</p>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Medio</span>
                    <p className="font-semibold text-blue-950">{projectLiner.medio?.tipo || "Cilindro"}</p>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Extremo Final</span>
                    <p className="font-semibold text-blue-950">{projectLiner.extremo_final?.tipo || "Ninguno"}</p>
                  </div>
                </div>
              ) : (
                <p className="text-white-400 italic">No se ha asignado un liner específico a este proyecto todavía.</p>
              )}
            </section>

            {/* Formulario de Capas */}
            <section className="bg-white-50 rounded-xl shadow-lg border border-blue-100 overflow-hidden animate-fadeIn" style={{ animationDelay: '0.2s' }}>
              <div className="bg-blue-900 p-4 text-white flex justify-between items-center">
                <h2 className="text-lg font-bold italic tracking-wide">
                  Capas del proyecto: {selectedProject.name.replace(/\s+/g, '_')}
                </h2>
                <button
                  onClick={() => setIsEditingOrder(!isEditingOrder)}
                  className={`p-1.5 rounded-lg transition-all ${isEditingOrder ? "bg-white text-blue-900 scale-110" : "hover:bg-white/20 text-white"}`}
                  title={isEditingOrder ? "Cancelar orden" : "Editar orden"}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
              </div>

              <div className="p-0">
                {localLayers.length === 0 ? (
                  <div className="p-12 text-center">
                    <div className="text-white-400 mb-4">
                      <svg className="w-16 h-16 mx-auto opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <p className="text-white-500 font-medium">El usuario todavía no ha creado ninguna capa.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-blue-50 border-b border-blue-100">
                        <tr>
                          <th className="px-6 py-4 text-xs font-bold text-blue-800 uppercase w-16">#</th>
                          <th className="px-6 py-4 text-xs font-bold text-blue-800 uppercase">Nombre</th>
                          <th className="px-6 py-4 text-xs font-bold text-blue-800 uppercase text-center w-48">Orden</th>
                          <th className="px-6 py-4 text-xs font-bold text-blue-800 uppercase text-right">Acción</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white-100">
                        {localLayers.map((layer: any, index: number) => (
                          <tr
                            key={layer.id || layer._id || `idx-${index}`}
                            className={`transition-colors ${layer.is_system ? 'bg-blue-50/30' : 'hover:bg-blue-50/30'}`}
                          >
                            <td className="px-6 py-4">
                              <span className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${layer.is_system ? 'bg-blue-100 text-blue-700' : 'bg-blue-100 text-blue-700'}`}>
                                {layer.orden_capa}
                              </span>
                            </td>
                            <td className="px-6 py-4 font-medium text-white-900">
                              <div>
                                <p className={`font-medium ${layer.is_system ? 'text-blue-900' : 'text-white-900'}`}>
                                  {layer.name || `Capa ${index + 1}`}
                                </p>
                                {layer.is_system && (
                                  <p className="text-[10px] font-bold text-blue-600 mt-0.5 uppercase tracking-wider">
                                    Vueltas: {layer.system_vueltas ?? 2}
                                  </p>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-center gap-2">
                                {!layer.is_system ? (
                                  <>
                                    <button
                                      onClick={() => {
                                        if (isEditingOrder) {
                                          const newLayers = [...localLayers];
                                          [newLayers[index], newLayers[index - 1]] = [newLayers[index - 1], newLayers[index]];
                                          setLocalLayers(newLayers);
                                        } else {
                                          handleReorderLayer(selectedProject.id, index, index - 1);
                                        }
                                      }}
                                      disabled={index <= 1 || !isEditingOrder} // Cannot move above "Start Layer" or if it is the first physical layer just after start.
                                      className={`p-1.5 rounded-md transition-all ${isEditingOrder ? "bg-blue-100 text-blue-700 hover:bg-blue-200" : "text-white-300 cursor-not-allowed"}`}
                                      title="Subir"
                                    >
                                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
                                      </svg>
                                    </button>
                                    <button
                                      onClick={() => {
                                        if (isEditingOrder) {
                                          const newLayers = [...localLayers];
                                          [newLayers[index], newLayers[index + 1]] = [newLayers[index + 1], newLayers[index]];
                                          setLocalLayers(newLayers);
                                        } else {
                                          handleReorderLayer(selectedProject.id, index, index + 1);
                                        }
                                      }}
                                      disabled={index >= localLayers.length - 1 || !isEditingOrder}
                                      className={`p-1.5 rounded-md transition-all ${isEditingOrder ? "bg-blue-100 text-blue-700 hover:bg-blue-200" : "text-white-300 cursor-not-allowed"}`}
                                      title="Bajar"
                                    >
                                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                                      </svg>
                                    </button>
                                  </>
                                ) : (
                                  <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-full uppercase tracking-widest border border-blue-100">
                                    Fija
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right flex justify-end gap-2">
                              {!isEditingOrder && (
                                <>
                                  <button
                                    onClick={() => {
                                      setEditingLayer(layer);
                                      if (!isAsideOpen) toggleAside();
                                    }}
                                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-bold rounded-lg transition-colors ${layer.is_system ? 'text-blue-600 hover:bg-blue-50' : 'text-blue-600 hover:bg-blue-50'}`}
                                  >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    {layer.is_system ? 'Ajustar' : 'Editar'}
                                  </button>
                                  {!layer.is_system && (
                                    <button
                                      onClick={() => handleDeleteLayer(layer.id)}
                                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                      </svg>
                                      Eliminar
                                    </button>
                                  )}
                                </>
                              )}
                              {isEditingOrder && (
                                <span className="text-xs font-bold text-blue-400 italic py-1.5">No modificable</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </section>

            {/* Acciones Finales */}
            <section className="mb-4 space-y-4">
              {isEditingOrder && (
                <div className="flex justify-center">
                  <button
                    onClick={() => handleBulkReorder(selectedProject.id, localLayers.filter(l => !l.is_system).map(l => l.id || l._id))}
                    className="flex items-center gap-3 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg transition-all active:scale-95"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Guardar orden de capas</span>
                  </button>
                </div>
              )}
              <div className="flex justify-center pt-4">
                <button
                  onClick={() => router.push("/capas/nuevaCapa")}
                  className="group relative flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <div className="bg-white/20 p-1 rounded-lg group-hover:rotate-90 transition-transform duration-300">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <span>Añadir Nueva Capa</span>
                </button>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}