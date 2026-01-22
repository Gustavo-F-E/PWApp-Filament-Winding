"use client";

import React, { useState } from "react";
import { useProyecto } from "../../CapasContext";

type EjeType = "X" | "Y" | "Z" | "A";
type UnidadType = "Radianes" | "Grados";

interface AxisValue {
    eje: EjeType;
    unidad?: UnidadType;
}

interface AxisSelectProps {
    label: string;
    value: AxisValue;
    onChange: (value: AxisValue) => void;
    showUnit?: boolean;
}

interface CoordenadasType {
    x_p: number;
    y_p: number;
    x_pp: number;
    y_pp: number;
}

export default function MaquinaPage() {
    const { fetchMachines, selectedProject } = useProyecto();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [machineName, setMachineName] = useState("");
    const [tipo, setTipo] = useState("CNC");
    const [posicionInicial, setPosicionInicial] = useState("giro horario");

    const [coordenadas, setCoordenadas] = useState<CoordenadasType>({
        x_p: 0,
        y_p: 0,
        x_pp: 0,
        y_pp: 0,
    });

    const [giroMandril, setGiroMandril] = useState<AxisValue>({
        eje: "X",
        unidad: "Radianes",
    });

    const [longitudinal, setLongitudinal] = useState<AxisValue>({
        eje: "Y",
    });

    const [giroDevanador, setGiroDevanador] = useState<AxisValue>({
        eje: "Z",
        unidad: "Radianes",
    });

    const [acercamientoDevanador, setAcercamientoDevanador] =
        useState<AxisValue>({
            eje: "A",
        });

    const [velocidad, setVelocidad] = useState(0);

    const API_BASE_URL =
        process.env.NEXT_PUBLIC_URL_BACKEND || "http://localhost:8000";

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            const token = localStorage.getItem("auth_token");
            const response = await fetch(`${API_BASE_URL}/machines/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name:
                        machineName ||
                        `Maquina ${selectedProject?.name || "Nueva"}`,
                    tipo,
                    posicion_inicial: posicionInicial,
                    coordenadas,
                    giro_mandril: giroMandril,
                    longitudinal: longitudinal,
                    giro_devanador: giroDevanador,
                    acercamiento_devanador: acercamientoDevanador,
                    velocidad_maquina: velocidad,
                }),
            });

            if (response.ok) {
                alert("Máquina guardada exitosamente");
                fetchMachines();
            } else {
                alert("Error al guardar máquina");
            }
        } catch (error) {
            console.error(error);
            alert("Error de conexión");
        } finally {
            setIsSubmitting(false);
        }
    };

    const AxisSelect = ({
        label,
        value,
        onChange,
        showUnit,
    }: AxisSelectProps) => (
        <div className="bg-white-50 p-4 rounded-lg border border-white-100">
            <label className="block text-sm font-bold text-white-700 mb-2">
                {label}
            </label>
            <div className="flex gap-4">
                <select
                    className="flex-1 border rounded px-3 py-1 outline-none focus:ring-1 focus:ring-blue-500"
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
                    <div className="flex gap-3 text-xs items-center">
                        <label className="flex items-center gap-1">
                            <input
                                type="radio"
                                checked={value.unidad === "Radianes"}
                                onChange={() =>
                                    onChange({ ...value, unidad: "Radianes" })
                                }
                            />{" "}
                            Rad
                        </label>
                        <label className="flex items-center gap-1">
                            <input
                                type="radio"
                                checked={value.unidad === "Grados"}
                                onChange={() =>
                                    onChange({ ...value, unidad: "Grados" })
                                }
                            />{" "}
                            Deg
                        </label>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="flex-1 overflow-y-auto col-[1/13] lg:grid lg:grid-rows-[repeat(17,1fr)] h-full text-white-400">
            <div className="row-[1/18] lg:col-[1/13] p-4">
                <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-md border border-blue-50">
                    <h1 className="text-2xl font-bold text-blue-950 mb-6 border-b pb-2">
                        Configuración de Máquina
                    </h1>

                    <form onSubmit={handleSave} className="space-y-6">
                        {/* Nombre y Tipo */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="w-full h-10vh">
                                <label className="block text-sm font-bold text-blue-900 mb-2">
                                    Nombre de la Configuración
                                </label>
                                <input
                                    type="text"
                                    className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Ej: CNC Standard 1"
                                    value={machineName}
                                    onChange={(e) =>
                                        setMachineName(e.target.value)
                                    }
                                    required
                                />
                            </div>
                            <div className="w-full h-10vh">
                                <label className="block text-sm font-bold text-blue-900 mb-2">
                                    Tipo de Máquina
                                </label>
                                <div className="flex bg-white-50 gap-6 mt-2 border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            checked={tipo === "CNC"}
                                            onChange={() => setTipo("CNC")}
                                        />
                                        <span>CNC</span>
                                    </label>
                                    <label className="flex items-center gap-2 text-white-400 cursor-not-allowed">
                                        <input type="radio" disabled />
                                        <span>Robot</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Posicion Inicial y Coordenadas */}
                        <section className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                            <h2 className="text-lg font-bold text-blue-900 mb-4">
                                Condiciones Iniciales
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white-50 gap-6 mt-2 border rounded-md px-3 py-3">
                                <div>
                                    <label className="block text-sm text-white-600 font-semibold mb-2">
                                        Posición Inicial
                                    </label>
                                    <div className="flex flex-col gap-2">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                checked={
                                                    posicionInicial ===
                                                    "giro horario"
                                                }
                                                onChange={() =>
                                                    setPosicionInicial(
                                                        "giro horario",
                                                    )
                                                }
                                            />
                                            <span>Giro Horario</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                checked={
                                                    posicionInicial ===
                                                    "giro antihorario"
                                                }
                                                onChange={() =>
                                                    setPosicionInicial(
                                                        "giro antihorario",
                                                    )
                                                }
                                            />
                                            <span>Giro Antihorario</span>
                                        </label>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    {["x_p", "y_p", "x_pp", "y_pp"].map((c) => (
                                        <div key={c}>
                                            <label className="text-xs font-bold text-white-600 block mb-1">
                                                {c === "x_p"
                                                    ? "X'"
                                                    : c === "y_p"
                                                      ? "Y'"
                                                      : c === "x_pp"
                                                        ? "X''"
                                                        : "Y''"}
                                            </label>
                                            <input
                                                type="number"
                                                className="w-full border rounded px-2 py-1 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                                                value={
                                                    coordenadas[
                                                        c as keyof CoordenadasType
                                                    ]
                                                }
                                                onChange={(e) =>
                                                    setCoordenadas({
                                                        ...coordenadas,
                                                        [c]: parseFloat(
                                                            e.target.value,
                                                        ),
                                                    })
                                                }
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* Ejes */}
                        <section>
                            <h2 className="text-lg font-bold text-blue-900 mb-4">
                                Asignación de Ejes
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <AxisSelect
                                    label="Giro Mandril"
                                    value={giroMandril}
                                    onChange={setGiroMandril}
                                    showUnit
                                />
                                <AxisSelect
                                    label="Longitudinal"
                                    value={longitudinal}
                                    onChange={setLongitudinal}
                                />
                                <AxisSelect
                                    label="Giro Devanador"
                                    value={giroDevanador}
                                    onChange={setGiroDevanador}
                                    showUnit
                                />
                                <AxisSelect
                                    label="Acercamiento Devanador"
                                    value={acercamientoDevanador}
                                    onChange={setAcercamientoDevanador}
                                />
                            </div>
                        </section>

                        {/* Velocidad */}
                        <div className="flex items-center gap-4 p-4 bg-white-50 border border-white-100 rounded-lg">
                            <label className="font-bold text-white-950">
                                Velocidad de la Máquina:
                            </label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    className="w-32 border rounded px-3 py-1 outline-none focus:ring-1 focus:ring-white-500"
                                    value={velocidad}
                                    onChange={(e) =>
                                        setVelocidad(parseFloat(e.target.value))
                                    }
                                />
                                <span className="text-sm font-semibold text-white-800">
                                    mm/min
                                </span>
                            </div>
                        </div>

                        <div className="pt-6 border-t flex justify-end">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-blue-600 text-white-50 px-8 py-3 rounded-lg font-bold hover:bg-blue-200 hover:text-blue-600 hover:border hover:border-blue-600 transition-colors shadow-lg disabled:opacity-50"
                            >
                                {isSubmitting
                                    ? "Guardando..."
                                    : "Guardar Máquina"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
