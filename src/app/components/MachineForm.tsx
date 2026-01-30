// src/app/components/MachineForm.tsx

"use client";

import React, { useState } from "react";
import { useProyecto } from "../proyecto/ProyectoContext";
import { handleNumericChangeValidation } from "@/utils/validation";

type EjeType = "X" | "Y" | "Z" | "A";
type UnidadType = "Radianes" | "Grados";

interface AxisValue {
  eje: EjeType;
  unidad?: UnidadType;
}

interface CoordenadasType {
  x_p: number;
  y_p: number;
  x_pp: number;
  y_pp: number;
}

interface MachineFormProps {
  initialData?: any;
  onSave: (data: any) => Promise<void>;
  onCancel: () => void;
  title?: string;
}

export default function MachineForm({ initialData, onSave, onCancel, title }: MachineFormProps) {
  const { selectedProject } = useProyecto();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [machineName, setMachineName] = useState(initialData?.name || "");
  const [tipo, setTipo] = useState(initialData?.tipo || "CNC");
  const [posicionInicial, setPosicionInicial] = useState(initialData?.posicion_inicial || "giro horario");

  const [coordenadas, setCoordenadas] = useState<CoordenadasType>(initialData?.coordenadas || {
    x_p: 0,
    y_p: 0,
    x_pp: 0,
    y_pp: 0,
  });

  const [giroMandril, setGiroMandril] = useState<AxisValue>(initialData?.giro_mandril || {
    eje: "X",
    unidad: "Radianes",
  });

  const [longitudinal, setLongitudinal] = useState<AxisValue>(initialData?.longitudinal || {
    eje: "Y",
  });

  const [giroDevanador, setGiroDevanador] = useState<AxisValue>(initialData?.giro_devanador || {
    eje: "Z",
    unidad: "Radianes",
  });

  const [acercamientoDevanador, setAcercamientoDevanador] = useState<AxisValue>(initialData?.acercamiento_devanador || {
    eje: "A",
  });

  const [velocidad, setVelocidad] = useState(initialData?.velocidad_maquina || 0);

  const onValidationError = (msg: string) => {
    alert(msg);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave({
        name: machineName || `Maquina ${selectedProject?.name || "Nueva"}`,
        tipo,
        posicion_inicial: posicionInicial,
        coordenadas,
        giro_mandril: giroMandril,
        longitudinal: longitudinal,
        giro_devanador: giroDevanador,
        acercamiento_devanador: acercamientoDevanador,
        velocidad_maquina: velocidad
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const AxisSelect = ({
    label,
    value,
    onChange,
    showUnit,
  }: {
    label: string;
    value: AxisValue;
    onChange: (val: AxisValue) => void;
    showUnit?: boolean;
  }) => (
    <div className="bg-white-50 p-4 rounded-lg border border-blue-100">
      <label className="block text-sm font-bold text-blue-900 mb-2">
        {label}
      </label>
      <div className="flex gap-4">
        <select
          className="flex-1 border rounded px-3 py-1 outline-none focus:ring-1 focus:ring-blue-500 text-gray-700"
          value={value.eje}
          onChange={(e) =>
            onChange({ ...value, eje: e.target.value as EjeType })
          }
        >
          {["X", "Y", "Z", "A"].map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
        {showUnit && (
          <div className="flex gap-3 text-xs items-center text-gray-700">
            {["Radianes", "Grados"].map((u) => (
              <label key={u} className="flex items-center gap-1">
                <input
                  type="radio"
                  checked={value.unidad === u}
                  onChange={() => onChange({ ...value, unidad: u as UnidadType })}
                />
                {u === "Radianes" ? "Rad" : "Deg"}
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-white rounded-xl shadow-md border border-blue-50">
      <h1 className="text-2xl font-bold text-blue-950 mb-6 border-b pb-2">
        {title || "Configuración de Máquina"}
      </h1>

      <form onSubmit={handleFormSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-sm font-bold text-blue-900 mb-2">
              Nombre de la Configuración
            </label>
            <input
              type="text"
              className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
              placeholder="Ej: CNC Standard 1"
              value={machineName}
              onChange={(e) => setMachineName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-blue-900 mb-2">
              Tipo de Máquina
            </label>
            <div className="flex bg-white-50 gap-6 border rounded-md px-3 py-2 text-gray-700">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={tipo === "CNC"}
                  onChange={() => setTipo("CNC")}
                />
                <span>CNC</span>
              </label>
              <label className="flex items-center gap-2 text-gray-400 cursor-not-allowed">
                <input type="radio" disabled />
                <span>Robot</span>
              </label>
            </div>
          </div>
        </div>

        <section className="bg-blue-50 p-6 rounded-xl border border-blue-100">
          <h2 className="text-lg font-bold text-blue-900 mb-4">
            Condiciones Iniciales
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-blue-800 font-semibold mb-2">
                Posición Inicial
              </label>
              <div className="flex flex-col gap-2 text-gray-700">
                {["giro horario", "giro antihorario"].map((p) => (
                  <label key={p} className="flex items-center gap-2 cursor-pointer capitalize">
                    <input
                      type="radio"
                      checked={posicionInicial === p}
                      onChange={() => setPosicionInicial(p)}
                    />
                    <span>{p}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {["x_p", "y_p", "x_pp", "y_pp"].map((c) => (
                <div key={c}>
                  <label className="text-xs font-bold text-blue-600 block mb-1">
                    {c.replace("_p", "'").replace("_pp", "''").toUpperCase()}
                  </label>
                  <input
                    type="text"
                    className="w-full border rounded px-2 py-1 text-sm outline-none focus:ring-1 focus:ring-blue-500 text-gray-700"
                    value={isNaN(coordenadas[c as keyof CoordenadasType]) ? "" : coordenadas[c as keyof CoordenadasType]}
                    onChange={(e) => {
                      handleNumericChangeValidation(e, onValidationError);
                      setCoordenadas({ ...coordenadas, [c]: parseFloat(e.target.value) || 0 });
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-blue-900 mb-4">
            Asignación de Ejes
          </h2>
          <div className="grid grid-cols-1 gap-4">
            <AxisSelect label="Giro Mandril" value={giroMandril} onChange={setGiroMandril} showUnit />
            <AxisSelect label="Longitudinal" value={longitudinal} onChange={setLongitudinal} />
            <AxisSelect label="Giro Devanador" value={giroDevanador} onChange={setGiroDevanador} showUnit />
            <AxisSelect label="Acercamiento Devanador" value={acercamientoDevanador} onChange={setAcercamientoDevanador} />
          </div>
        </section>

        <div className="flex items-center gap-4 p-4 bg-white-50 border border-blue-100 rounded-lg">
          <label className="font-bold text-blue-950">Velocidad:</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              className="w-32 border rounded px-3 py-1 outline-none focus:ring-1 focus:ring-blue-500 text-gray-700"
              value={isNaN(velocidad) ? "" : velocidad}
              onChange={(e) => {
                handleNumericChangeValidation(e, onValidationError);
                setVelocidad(parseFloat(e.target.value) || 0);
              }}
            />
            <span className="text-sm font-semibold text-blue-800">mm/min</span>
          </div>
        </div>

        <div className="pt-6 border-t flex flex-col gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-lg disabled:opacity-50"
          >
            {isSubmitting ? "Guardando..." : initialData ? "Actualizar Máquina" : "Guardar Máquina"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
