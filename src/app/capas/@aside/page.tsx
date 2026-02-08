// src/app/capas/@aside/page.tsx

"use client";

import React from "react";
import { useCapas } from "../CapasContext";
import LayerForm from "@/app/components/LayerForm";

export default function CapasAside() {
  const { editingLayer, setEditingLayer, handleUpdateLayer, isSubmitting, toggleAside } = useCapas();

  if (!editingLayer) {
    return (
      <div className="p-4 text-center">
        <h2 className="text-xl font-bold text-blue-900">Gestión de Capas</h2>
        <p className="text-sm text-white-500 mt-2">
          Selecciona una capa para editar sus detalles.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <LayerForm
        title="Editar Capa"
        initialData={editingLayer}
        isSubmitting={isSubmitting}
        onCancel={() => {
          setEditingLayer(null);
          toggleAside();
        }}
        onSave={(data) => handleUpdateLayer(editingLayer.id!, data)}
      />
    </div>
  );
}
