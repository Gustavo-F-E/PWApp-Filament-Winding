// src/app/proyecto/@main/liner/page.tsx

"use client";

import React from "react";
import { useProyecto } from "../../ProyectoContext";
import LinerForm from "@/app/components/LinerForm";

export default function LinerPage() {
  const { fetchLiners, selectedProject } = useProyecto();

  const API_BASE_URL = process.env.NEXT_PUBLIC_URL_BACKEND || "http://localhost:8000";

  const handleSave = async (data: any) => {
    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch(`${API_BASE_URL}/liners/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
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
    }
  };

  return (
    <div className="flex-1 overflow-y-auto col-[1/13] lg:grid lg:grid-rows-[repeat(17,1fr)] h-full">
      <div className="row-[1/18] lg:col-[1/13] p-4">
        <LinerForm
          onSave={handleSave}
          onCancel={() => { }}
          title="Definición de Liner (Mandril)"
        />
      </div>
    </div>
  );
}
