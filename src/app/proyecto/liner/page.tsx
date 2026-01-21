"use client";

import React, { useState } from "react";
import { useProyecto } from "../ProyectoContext";

export default function LinerPage() {
    const { fetchLiners, selectedProject } = useProyecto();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [linerName, setLinerName] = useState("");
    const [tipoLiner, setTipoLiner] = useState("simple");

    const [extremoInicial, setExtremoInicial] = useState({
        tipo: "Ninguno",
        diametro_menor: 0,
        diametro_mayor: 0
    });

    const [medio, setMedio] = useState({
        tipo: "Cilindro",
        longitud: 0,
        diametro: 0,
        diametro_mayor: 0,
        diametro_menor: 0
    });

    const [extremoFinal, setExtremoFinal] = useState({
        tipo: "Ninguno",
        diametro_menor: 0,
        diametro_mayor: 0
    });

    const API_BASE_URL = process.env.NEXT_PUBLIC_URL_BACKEND || "http://localhost:8000";

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            const token = localStorage.getItem("auth_token");
            const response = await fetch(`${API_BASE_URL}/liners/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: linerName || `Liner ${selectedProject?.name || "Nuevo"}`,
                    tipo_liner: tipoLiner,
                    extremo_inicial: extremoInicial,
                    medio: medio,
                    extremo_final: extremoFinal
                })
            });

            if (response.ok) {
                alert("Mandril guardado exitosamente");
                fetchLiners();
            } else {
                alert("Error al guardar mandril");
            }
        } catch (error) {
            console.error(error);
            alert("Error de conexión");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-md border border-blue-50">
            <h1 className="text-2xl font-bold text-blue-950 mb-6 border-b pb-2">Definición de Liner (Mandril)</h1>

            <form onSubmit={handleSave} className="space-y-8">
                {/* Nombre del Liner */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-blue-900 mb-1">Nombre del Mandril</label>
                        <input 
                            type="text" 
                            className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Ej: Liner de Vidrio 1"
                            value={linerName}
                            onChange={(e) => setLinerName(e.target.value)}
                            required
                        />
                    </div>
                </div>

                {/* Tipo de Liner */}
                <section>
                    <h2 className="text-lg font-semibold text-blue-800 mb-3">Tipo de Liner</h2>
                    <div className="flex gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" value="simple" checked={tipoLiner === "simple"} onChange={() => setTipoLiner("simple")} />
                            <span>Simple</span>
                        </label>
                        <label className="flex items-center gap-2 text-gray-400 cursor-not-allowed">
                            <input type="radio" disabled />
                            <span>Compuesto</span>
                        </label>
                        <label className="flex items-center gap-2 text-gray-400 cursor-not-allowed">
                            <input type="radio" disabled />
                            <span>No-axisimetrico</span>
                        </label>
                    </div>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Extremo Inicial */}
                    <section className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <h2 className="font-bold text-blue-900 mb-4 border-b border-blue-200 pb-1">Extremo Inicial</h2>
                        <div className="space-y-4">
                            <label className="block text-sm font-semibold">Tipo</label>
                            {["Ninguno", "Semiesferico", "Isotensoide", "Conico"].map(t => (
                                <label key={t} className="flex items-center gap-2 text-sm cursor-pointer">
                                    <input type="radio" checked={extremoInicial.tipo === t} onChange={() => setExtremoInicial({...extremoInicial, tipo: t})} />
                                    {t}
                                </label>
                            ))}
                            <div className="grid grid-cols-1 gap-2 mt-4">
                                <label className="text-xs font-bold text-gray-600">Diámetro Menor</label>
                                <input 
                                    type="number" 
                                    className="w-full border rounded p-1 text-sm disabled:bg-gray-200 disabled:text-gray-400"
                                    disabled={extremoInicial.tipo === "Ninguno"}
                                    value={extremoInicial.diametro_menor}
                                    onChange={(e) => setExtremoInicial({...extremoInicial, diametro_menor: parseFloat(e.target.value)})}
                                />
                                <label className="text-xs font-bold text-gray-600">Diámetro Mayor</label>
                                <input 
                                    type="number" 
                                    className="w-full border rounded p-1 text-sm disabled:bg-gray-200 disabled:text-gray-400"
                                    disabled={extremoInicial.tipo === "Ninguno"}
                                    value={extremoInicial.diametro_mayor}
                                    onChange={(e) => setExtremoInicial({...extremoInicial, diametro_mayor: parseFloat(e.target.value)})}
                                />
                            </div>
                        </div>
                    </section>

                    {/* Medio */}
                    <section className="bg-green-50 p-4 rounded-lg border border-green-100">
                        <h2 className="font-bold text-green-900 mb-4 border-b border-green-200 pb-1">Sección Media</h2>
                        <div className="space-y-4">
                            <div className="flex gap-4 mb-4">
                                <label className="flex items-center gap-2 text-sm cursor-pointer">
                                    <input type="radio" checked={medio.tipo === "Cilindro"} onChange={() => setMedio({...medio, tipo: "Cilindro"})} />
                                    Cilindro
                                </label>
                                <label className="flex items-center gap-2 text-sm cursor-pointer">
                                    <input type="radio" checked={medio.tipo === "Conico"} onChange={() => setMedio({...medio, tipo: "Conico"})} />
                                    Conico
                                </label>
                            </div>
                            <div className="grid grid-cols-1 gap-3">
                                <div>
                                    <label className="text-xs font-bold text-gray-600">Longitud</label>
                                    <input type="number" className="w-full border rounded p-1 text-sm" value={medio.longitud} onChange={(e) => setMedio({...medio, longitud: parseFloat(e.target.value)})} />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-600">Diámetro</label>
                                    <input 
                                        type="number" 
                                        className="w-full border rounded p-1 text-sm disabled:bg-gray-200" 
                                        disabled={medio.tipo !== "Cilindro"}
                                        value={medio.diametro}
                                        onChange={(e) => setMedio({...medio, diametro: parseFloat(e.target.value)})}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="text-xs font-bold text-gray-600">D. Mayor</label>
                                        <input 
                                            type="number" 
                                            className="w-full border rounded p-1 text-sm disabled:bg-gray-200" 
                                            disabled={medio.tipo !== "Conico"}
                                            value={medio.diametro_mayor}
                                            onChange={(e) => setMedio({...medio, diametro_mayor: parseFloat(e.target.value)})}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-600">D. Menor</label>
                                        <input 
                                            type="number" 
                                            className="w-full border rounded p-1 text-sm disabled:bg-gray-200" 
                                            disabled={medio.tipo !== "Conico"}
                                            value={medio.diametro_menor}
                                            onChange={(e) => setMedio({...medio, diametro_menor: parseFloat(e.target.value)})}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Extremo Final */}
                    <section className="bg-red-50 p-4 rounded-lg border border-red-100">
                        <h2 className="font-bold text-red-900 mb-4 border-b border-red-200 pb-1">Extremo Final</h2>
                        <div className="space-y-4">
                            <label className="block text-sm font-semibold">Tipo</label>
                            {["Ninguno", "Semiesferico", "Isotensoide", "Conico"].map(t => (
                                <label key={t} className="flex items-center gap-2 text-sm cursor-pointer">
                                    <input type="radio" checked={extremoFinal.tipo === t} onChange={() => setExtremoFinal({...extremoFinal, tipo: t})} />
                                    {t}
                                </label>
                            ))}
                            <div className="grid grid-cols-1 gap-2 mt-4">
                                <label className="text-xs font-bold text-gray-600">Diámetro Menor</label>
                                <input 
                                    type="number" 
                                    className="w-full border rounded p-1 text-sm disabled:bg-gray-200 disabled:text-gray-400"
                                    disabled={extremoFinal.tipo === "Ninguno"}
                                    value={extremoFinal.diametro_menor}
                                    onChange={(e) => setExtremoFinal({...extremoFinal, diametro_menor: parseFloat(e.target.value)})}
                                />
                                <label className="text-xs font-bold text-gray-600">Diámetro Mayor</label>
                                <input 
                                    type="number" 
                                    className="w-full border rounded p-1 text-sm disabled:bg-gray-200 disabled:text-gray-400"
                                    disabled={extremoFinal.tipo === "Ninguno"}
                                    value={extremoFinal.diametro_mayor}
                                    onChange={(e) => setExtremoFinal({...extremoFinal, diametro_mayor: parseFloat(e.target.value)})}
                                />
                            </div>
                        </div>
                    </section>
                </div>

                <div className="pt-6 border-t flex justify-end">
                    <button 
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-lg disabled:opacity-50"
                    >
                        {isSubmitting ? "Guardando..." : "Guardar Mandril"}
                    </button>
                </div>
            </form>
        </div>
    );
}
