// src/app/proyecto/@main/maquina/page.tsx

"use client";

import React from "react";
import { useProyecto } from "../../ProyectoContext";
import MachineForm from "@/app/components/MachineForm";

export default function MaquinaPage() {
  const { fetchMachines } = useProyecto();

  const API_BASE_URL = process.env.NEXT_PUBLIC_URL_BACKEND || "http://localhost:8000";

  const handleSave = async (data: any) => {
    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch(`${API_BASE_URL}/machines/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(data)
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
    }
  };

  return (
    <div className="flex-1 overflow-y-auto col-[1/13] lg:grid lg:grid-rows-[repeat(17,1fr)] h-full">
      <div className="row-[1/18] lg:col-[1/13] p-4">
        <MachineForm
          onSave={handleSave}
          onCancel={() => { }}
          title="Configuración de Máquina"
        />
      </div>
    </div>
  );
}
