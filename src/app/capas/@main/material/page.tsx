// src/app/capas/@main/nuevaCapa/page.tsx

"use client";

import React from "react";
import { useProyecto } from "../../CapasContext";
import { useRouter } from "next/navigation";

export default function nuevaCapaPage() {
  const { isSubmitting, handleFormSubmit } = useCapa();
  const router = useRouter();

  const onSubmit = (formData: { name: string; description: string }) => {
    handleFormSubmit(formData);
    // La lógica de redirección ya está en handleFormSubmit o debería estarlo.
    // Pero handleFormSubmit actualmente solo hace el fetch y un alert.
  };

  const onCancel = () => {
    router.back();
  };

  return (
    <div className="flex-1 overflow-y-auto col-[1/13] lg:grid lg:grid-rows-[repeat(17,1fr)] h-full">
      <div className="row-[1/18] lg:col-[1/13] p-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-blue-950 mb-4">
            Crear Nueva Capa
          </h1>
          <form
            onSubmit={handleSubmit}
            className="space-y-6 p-6 bg-white rounded-lg shadow-lg border border-blue-100"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-blue-900">
                {project ? "Configurar Capa" : "Nueva Capa"}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del Material
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

            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Espesor de capa
              </label>
              <input
                type="number"
                id="espesor"
                name="espesor"
                min="0"
                max="5"
                step="0.01"
              ></input>
              <output>2.5</output>
            </div>
            <div>
              <label  className="block text-sm font-medium text-gray-700 mb-1">
                Ancho de la cinta de la fibra
              </label>
              <input
                type="number"
                id="ancho_cinta"
                name="ancho_cinta"
                min="0"
                step="0.01"
              ></input>
            </div>
            <div>
              <label  className="block text-sm font-medium text-gray-700 mb-1">
                Coeficiente de rozamiento
              </label>
              <input
                type="number"
                id="coeficiente_roce"
                name="coeficiente_roce"
                min="0"
                step="0.01"
              ></input>
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
            {isSubmitting
              ? "Guardando..."
              : project
                ? "Actualizar"
                : "Generar Patrones"}
          </button>
        </div>
      </form>
    </div>
            </div >
        </div >
    );
}
