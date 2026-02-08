// src/app/components/LinerForm.tsx

"use client";

import React, { useState, useEffect } from "react";
import { useProyecto } from "../proyecto/ProyectoContext";
import { handleNumericChangeValidation } from "@/utils/validation";

interface LinerFormProps {
  initialData?: any;
  onSave: (data: any) => Promise<void>;
  onCancel: () => void;
  title?: string;
}

export default function LinerForm({ initialData, onSave, onCancel, title }: LinerFormProps) {
  const { selectedProject } = useProyecto();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [linerName, setLinerName] = useState(initialData?.name || "");
  const [linerDescription, setLinerDescription] = useState(initialData?.description || "");
  const [tipoLiner, setTipoLiner] = useState(initialData?.tipo_liner || "simple");

  const [extremoInicial, setExtremoInicial] = useState(initialData?.extremo_inicial || {
    tipo: "Ninguno",
    diametro_menor: 0,
    diametro_mayor: 0,
  });

  const [medio, setMedio] = useState(initialData?.medio || {
    tipo: "Cilindro",
    longitud: 0,
    diametro: 0,
    diametro_mayor: 0,
    diametro_menor: 0,
  });

  const [extremoFinal, setExtremoFinal] = useState(initialData?.extremo_final || {
    tipo: "Ninguno",
    diametro_menor: 0,
    diametro_mayor: 0,
  });

  const onValidationError = (msg: string) => {
    alert(msg);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave({
        name: linerName || `Liner ${selectedProject?.name || "Nuevo"}`,
        description: linerDescription,
        tipo_liner: tipoLiner,
        extremo_inicial: extremoInicial,
        medio: medio,
        extremo_final: extremoFinal,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-blue-50 p-6 max-w-full">
      <h1 className="text-2xl font-bold text-blue-950 mb-6 border-b pb-2">
        {title || "Definición de Liner (Mandril)"}
      </h1>

      <form onSubmit={handleFormSubmit} className="space-y-8">
        {/* Nombre del Liner */}
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-lg font-semibold text-blue-800 mb-1">
              Nombre del Mandril
            </label>
            <input
              type="text"
              className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 text-white-700"
              placeholder="Ej: Liner de Vidrio 1"
              value={linerName}
              onChange={(e) => setLinerName(e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-lg font-semibold text-blue-800 mb-1">
            Descripción
          </label>
          <textarea
            name="description"
            value={linerDescription}
            onChange={(e) => setLinerDescription(e.target.value)}
            rows={2}
            className="w-full px-3 py-2 text-white-700 border border-white-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Descripción breve"
            disabled={isSubmitting}
          />
        </div>

        {/* Tipo de Liner */}
        <section>
          <h2 className="text-lg font-semibold text-blue-800 mb-3">
            Tipo de Liner
          </h2>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="simple"
                checked={tipoLiner === "simple"}
                onChange={() => setTipoLiner("simple")}
              />
              <span className="text-white-700">Simple</span>
            </label>
            <label className="flex items-center gap-2 text-white-400 cursor-not-allowed">
              <input type="radio" disabled />
              <span>Compuesto</span>
            </label>
            <label className="flex items-center gap-2 text-white-400 cursor-not-allowed">
              <input type="radio" disabled />
              <span>No-axisimetrico</span>
            </label>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-8">
          {/* Extremo Inicial */}
          <section className="bg-white-50 p-4 rounded-lg border border-blue-100">
            <h2 className="font-bold text-blue-900 mb-4 border-b border-blue-200 pb-1">
              Extremo Inicial
            </h2>
            <div className="space-y-4">
              <label className="block text-sm font-semibold">Tipo</label>
              {["Ninguno", "Semiesferico", "Isotensoide", "Conico"].map((t) => (
                <label key={t} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="radio"
                    checked={extremoInicial.tipo === t}
                    onChange={() => setExtremoInicial({ ...extremoInicial, tipo: t })}
                  />
                  <span className="text-white-700">{t}</span>
                </label>
              ))}
              <div className="grid grid-cols-1 gap-2 mt-4 text-white-700">
                <label className="text-xs font-bold text-blue-600">Diámetro Menor</label>
                <input
                  type="text"
                  className="w-full border rounded p-1 text-sm disabled:bg-white-100"
                  disabled={extremoInicial.tipo === "Ninguno"}
                  value={isNaN(extremoInicial.diametro_menor) ? "" : extremoInicial.diametro_menor}
                  onChange={(e) => {
                    handleNumericChangeValidation(e, onValidationError);
                    setExtremoInicial({ ...extremoInicial, diametro_menor: parseFloat(e.target.value) || 0 });
                  }}
                />
                <label className="text-xs font-bold text-blue-600">Diámetro Mayor</label>
                <input
                  type="text"
                  className="w-full border rounded p-1 text-sm disabled:bg-white-100"
                  disabled={extremoInicial.tipo === "Ninguno"}
                  value={isNaN(extremoInicial.diametro_mayor) ? "" : extremoInicial.diametro_mayor}
                  onChange={(e) => {
                    handleNumericChangeValidation(e, onValidationError);
                    setExtremoInicial({ ...extremoInicial, diametro_mayor: parseFloat(e.target.value) || 0 });
                  }}
                />
              </div>
            </div>
          </section>

          {/* Medio */}
          <section className="bg-white-50 p-4 rounded-lg border border-blue-100">
            <h2 className="font-bold text-blue-900 mb-4 border-b border-blue-200 pb-1">
              Sección Media
            </h2>
            <div className="space-y-4">
              <div className="flex gap-4 mb-4">
                {["Cilindro", "Conico"].map((t) => (
                  <label key={t} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="radio"
                      checked={medio.tipo === t}
                      onChange={() => setMedio({ ...medio, tipo: t })}
                    />
                    <span className="text-white-700">{t}</span>
                  </label>
                ))}
              </div>
              <div className="grid grid-cols-1 gap-3 text-white-700">
                <div>
                  <label className="text-xs font-bold text-blue-600">Longitud útil</label>
                  <input
                    type="text"
                    className="w-full border rounded p-1 text-sm"
                    value={isNaN(medio.longitud) ? "" : medio.longitud}
                    onChange={(e) => {
                      handleNumericChangeValidation(e, onValidationError);
                      setMedio({ ...medio, longitud: parseFloat(e.target.value) || 0 });
                    }}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-blue-600">Diámetro</label>
                  <input
                    type="text"
                    className="w-full border rounded p-1 text-sm disabled:bg-white-100"
                    disabled={medio.tipo !== "Cilindro"}
                    value={isNaN(medio.diametro) ? "" : medio.diametro}
                    onChange={(e) => {
                      handleNumericChangeValidation(e, onValidationError);
                      setMedio({ ...medio, diametro: parseFloat(e.target.value) || 0 });
                    }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-bold text-blue-600">D. Mayor</label>
                    <input
                      type="text"
                      className="w-full border rounded p-1 text-sm disabled:bg-white-100"
                      disabled={medio.tipo !== "Conico"}
                      value={isNaN(medio.diametro_mayor) ? "" : medio.diametro_mayor}
                      onChange={(e) => {
                        handleNumericChangeValidation(e, onValidationError);
                        setMedio({ ...medio, diametro_mayor: parseFloat(e.target.value) || 0 });
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-blue-600">D. Menor</label>
                    <input
                      type="text"
                      className="w-full border rounded p-1 text-sm disabled:bg-white-100"
                      disabled={medio.tipo !== "Conico"}
                      value={isNaN(medio.diametro_menor) ? "" : medio.diametro_menor}
                      onChange={(e) => {
                        handleNumericChangeValidation(e, onValidationError);
                        setMedio({ ...medio, diametro_menor: parseFloat(e.target.value) || 0 });
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Extremo Final */}
          <section className="bg-white-50 p-4 rounded-lg border border-blue-100">
            <h2 className="font-bold text-blue-900 mb-4 border-b border-blue-200 pb-1">
              Extremo Final
            </h2>
            <div className="space-y-4">
              <label className="block text-sm font-semibold">Tipo</label>
              {["Ninguno", "Semiesferico", "Isotensoide", "Conico"].map((t) => (
                <label key={t} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="radio"
                    checked={extremoFinal.tipo === t}
                    onChange={() => setExtremoFinal({ ...extremoFinal, tipo: t })}
                  />
                  <span className="text-white-700">{t}</span>
                </label>
              ))}
              <div className="grid grid-cols-1 gap-2 mt-4 text-white-700">
                <label className="text-xs font-bold text-blue-600">Diámetro Menor</label>
                <input
                  type="text"
                  className="w-full border rounded p-1 text-sm disabled:bg-white-100"
                  disabled={extremoFinal.tipo === "Ninguno"}
                  value={isNaN(extremoFinal.diametro_menor) ? "" : extremoFinal.diametro_menor}
                  onChange={(e) => {
                    handleNumericChangeValidation(e, onValidationError);
                    setExtremoFinal({ ...extremoFinal, diametro_menor: parseFloat(e.target.value) || 0 });
                  }}
                />
                <label className="text-xs font-bold text-blue-600">Diámetro Mayor</label>
                <input
                  type="text"
                  className="w-full border rounded p-1 text-sm disabled:bg-white-100"
                  disabled={extremoFinal.tipo === "Ninguno"}
                  value={isNaN(extremoFinal.diametro_mayor) ? "" : extremoFinal.diametro_mayor}
                  onChange={(e) => {
                    handleNumericChangeValidation(e, onValidationError);
                    setExtremoFinal({ ...extremoFinal, diametro_mayor: parseFloat(e.target.value) || 0 });
                  }}
                />
              </div>
            </div>
          </section>
        </div>

        <div className="pt-6 border-t flex flex-col gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-lg disabled:opacity-50"
          >
            {isSubmitting ? "Guardando..." : initialData ? "Actualizar Mandril" : "Guardar Mandril"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="w-full bg-white-200 text-white-700 py-2 rounded-lg font-semibold hover:bg-white-300 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
