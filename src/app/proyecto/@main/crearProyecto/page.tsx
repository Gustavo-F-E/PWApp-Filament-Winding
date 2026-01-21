"use client";

import React from "react";
import ProjectForm from "../../../components/ProjectForm";
import { useProyecto } from "../../ProyectoContext";
import { useRouter } from "next/navigation";

export default function CrearProyectoPage() {
    const {
        isSubmitting,
        handleFormSubmit,
    } = useProyecto();
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
                        Crear Nuevo Proyecto
                    </h1>
                    <ProjectForm
                        onSubmit={onSubmit}
                        onCancel={onCancel}
                        isSubmitting={isSubmitting}
                    />
                </div>
            </div>
        </div>
    );
}
