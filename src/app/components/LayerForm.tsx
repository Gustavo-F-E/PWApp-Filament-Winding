// src/app/components/LayerForm.tsx

"use client";

import React, { useState, useEffect } from "react";
import { Layer } from "../capas/CapasContext";
import { useProyecto } from "../proyecto/ProyectoContext";

interface LayerFormProps {
  initialData: Partial<Layer>;
  onSave: (data: Partial<Layer>) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
  title: string;
}

export default function LayerForm({ initialData, onSave, onCancel, isSubmitting, title }: LayerFormProps) {
  const [formData, setFormData] = useState<Partial<Layer>>(initialData);
  const { materials } = useProyecto();

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    // Handle numeric fields (removed material properties: espesor, ancho, coeficiente_rozamiento)
    const numericFields = ["velocidad_de_alimentacion", "alfa_original", "NP", "patron_elegido", "pines", "system_vueltas"];
    let val: any = value;

    if (numericFields.includes(name)) {
      val = value === "" ? 0 : (name === "NP" || name === "patron_elegido" || name === "pines" || name === "system_vueltas" ? parseInt(value) : parseFloat(value));
    }

    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleMaterialChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const materialName = e.target.value;
    const selectedMat = materials.find(m => m.name === materialName);
    if (selectedMat) {
      setFormData(prev => ({
        ...prev,
        material_name: selectedMat.name,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-white-50 rounded-xl shadow-lg border border-blue-100 h-fit">
      <div className="border-b border-blue-50 pb-4 mb-4">
        <h3 className="text-xl font-bold text-blue-900">{title}</h3>
        <p className="text-sm text-white-400">Completa los parámetros de la capa</p>
      </div>

      <div className="space-y-4">
        {/* Información Básica */}
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-bold text-blue-800 mb-1">Nombre de la Capa</label>
            <input
              type="text"
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border text-white-400 border-blue-100 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="Ej: Capa Estructural 1"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-blue-800 mb-1">Descripción</label>
            <textarea
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              rows={2}
              className="w-full px-3 py-2 text-white-400 border border-blue-100 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="Detalles adicionales..."
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Geometría y Pines (Hide for System Layers) */}
        {!formData.is_system && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-blue-800 mb-1">Ángulo (alfa)</label>
              <select
                name="alfa_original"
                value={formData.alfa_original || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 text-white-400 border border-blue-100 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white"
                disabled={isSubmitting}
                required
              >
                <option value="">Seleccionar Ángulo</option>
                {/* @ts-ignore */}
                <option value="hoop_ida">HOOP (ida)</option>
                {Array.from({ length: 85 }, (_, i) => i + 5).map(a => (
                  <option key={a} value={a}>±{a}°</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-blue-800 mb-1">Pines</label>
              <select
                name="pines"
                value={formData.pines === 1 ? "1" : "0"}
                onChange={(e) => setFormData(prev => ({ ...prev, pines: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 text-white-400 border border-blue-100 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white"
                disabled={isSubmitting}
              >
                <option value="1">Sí</option>
                <option value="0">No</option>
              </select>
            </div>
          </div>
        )}

        {/* Material (Hide for System Layers) */}
        {!formData.is_system && (
          <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
            <label className="block text-sm font-bold text-blue-900 mb-2">Material *</label>
            <select
              value={formData.material_name || ""}
              onChange={handleMaterialChange}
              className="w-full px-3 py-2 text-white-400 border border-blue-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 mb-3 bg-white"
              disabled={isSubmitting}
              required
            >
              <option value="">-- Seleccionar Material --</option>
              {materials.map(m => (
                <option key={m.id} value={m.name}>{m.name}</option>
              ))}
            </select>
            {formData.material_name && materials.find(m => m.name === formData.material_name) && (
              <div className="mt-2 text-xs text-blue-700 bg-blue-100 p-2 rounded border border-blue-200">
                <div><strong>Ancho:</strong> {materials.find(m => m.name === formData.material_name)?.ancho} mm</div>
                <div><strong>Espesor:</strong> {materials.find(m => m.name === formData.material_name)?.espesor} mm</div>
                <div><strong>Coef. Rozamiento:</strong> {materials.find(m => m.name === formData.material_name)?.coeficiente_rozamiento}</div>
              </div>
            )}
          </div>
        )}

        {/* Nº de Vueltas (Only for System Layers) */}
        {formData.is_system && (
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
            <label className="block text-sm font-bold text-blue-900 mb-2">Nº de vueltas</label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                name="system_vueltas"
                min="0"
                max="4"
                step="1"
                value={formData.system_vueltas ?? 2}
                onChange={handleChange}
                className="flex-1 h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                disabled={isSubmitting}
              />
              <span className="text-xl font-bold text-blue-700 w-8 text-center">
                {formData.system_vueltas ?? 2}
              </span>
            </div>
            <p className="mt-2 text-[10px] text-blue-700 italic">
              * Define la cantidad de revoluciones para esta zona de transición o inicio.
            </p>
          </div>
        )}

        {/* Patrón de Bobinado (Hide for System Layers) */}
        {!formData.is_system && (
          <div className="bg-blue-100 p-4 rounded-xl border border-blue-100">
            <label className="block text-sm font-bold text-blue-900 mb-2">Configuración de Patrón</label>
            <div className="space-y-3">
              <div className="grid grid-cols-1 gap-3 text-sm">
                <div className="bg-white p-2 rounded border border-blue-200">
                  <span className="block text-xs font-bold text-blue-500 uppercase">Patrón Elegido</span>
                  <span className="font-mono font-bold text-blue-900">{formData.patron_elegido || "0"}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  // Redirigir a la página de selección de patrón
                  // Usamos window.location o router si estuviera disponible, pero aqui no tenemos router props faciles.
                  // Pero como es componente cliente, podemos usar window.
                  if (initialData.id && initialData.nombre_proyecto) { // Es edición
                    // Necesitamos el project ID. 
                    // Lo tenemos en el selectedProject del contexto?
                    // Si, importamos useProyecto.
                    // Pero mejor dejar que el usuario seleccione si no estamos seguros,
                    // o pasar el projectId como prop.
                    // Asumiremos que el usuario seleccionará el proyecto en la sig página si no se pasa.
                    // Pero intentemos pasar params.
                    const baseUrl = "/capas/seleccionarPatron";
                    // Nota: No tenemos el projectId directo en layer data a veces, solo el nombre.
                    // Pero CapasContext -> selectedProject deberia estar sync
                    window.location.href = `${baseUrl}?layerId=${initialData.id || initialData._id}`;
                  } else {
                    window.location.href = "/capas/seleccionarPatron";
                  }
                }}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
                Generar / Seleccionar Patrón
              </button>
            </div>
            <p className="mt-2 text-[10px] text-blue-700 italic">
              * Estos valores definen la repetición y secuencia del bobinado.
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-3 pt-6 border-t border-blue-50 mt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-white-300 rounded-xl text-white-700 font-bold hover:bg-white-50 transition-all active:scale-95"
          disabled={isSubmitting}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-8 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-md hover:shadow-lg transition-all active:scale-95 disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Guardando..." : "Guardar Cambios"}
        </button>
      </div>
    </form>
  );
}
