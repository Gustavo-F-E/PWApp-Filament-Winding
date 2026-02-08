// src\app\components\ProyectoAsideLogic.tsx

"use client";

import React, { useEffect } from "react";
import { useProyecto } from "@/app/proyecto/ProyectoContext";
import AsideProyecto from "@/app/components/AsideProyecto";
import LinerForm from "@/app/components/LinerForm";
import MachineForm from "@/app/components/MachineForm";
import ProjectForm from "@/app/components/ProjectForm";

export default function ProyectoAsideLogic() {
  const {
    selectedProject,
    handleFormSubmit,
    isSubmitting,
    editingProject,
    setEditingProject,
    editingLiner,
    setEditingLiner,
    handleUpdateLiner,
    editingMachine,
    setEditingMachine,
    handleUpdateMachine,
  } = useProyecto();

  // Reset edit modes when selection changes
  useEffect(() => {
    if (selectedProject) {
      setEditingProject(null);
      setEditingLiner(null);
      setEditingMachine(null);
    }
  }, [selectedProject?.id, setEditingProject, setEditingLiner, setEditingMachine]);

  // VISTA: Edición de Liner
  if (editingLiner) {
    return (
      <div className="h-full p-4 bg-blue-100">
        <LinerForm
          initialData={editingLiner}
          onSave={async (data) => {
            await handleUpdateLiner(editingLiner.id, data);
            setEditingLiner(null);
          }}
          onCancel={() => setEditingLiner(null)}
          title="Editar Liner (Mandril)"
        />
      </div>
    );
  }

  // VISTA: Edición de Máquina
  if (editingMachine) {
    return (
      <div className="h-full p-4 bg-blue-100">
        <MachineForm
          initialData={editingMachine}
          onSave={async (data) => {
            await handleUpdateMachine(editingMachine.id, data);
            setEditingMachine(null);
          }}
          onCancel={() => setEditingMachine(null)}
          title="Editar Máquina"
        />
      </div>
    );
  }

  // VISTA: Edición de Proyecto
  if (editingProject) {
    return (
      <div className="h-full p-4 bg-blue-100">
        <ProjectForm
          onSubmit={async (data) => {
            await handleFormSubmit(data);
            setEditingProject(null);
          }}
          onCancel={() => setEditingProject(null)}
          isSubmitting={isSubmitting}
        />
      </div>
    );
  }

  // VISTA: Por defecto (Bienvenida)
  return (
    <div className="h-full flex items-center justify-center p-4">
      <AsideProyecto />
    </div>
  );
}
