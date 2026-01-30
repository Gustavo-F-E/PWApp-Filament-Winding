"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { useProyecto } from "../proyecto/ProyectoContext";

export interface Layer {
  name: string;
  description: string;
  longitud_util: number;
  espesor: number;
  coeficiente_rozamiento: number;
  pines: number;
  alfa_original: number;
  alfa_corregido: number;
  velocidad_de_alimentacion: number;
  ancho: number;
  ancho_eff: number;
  NP: number;
  patron_elegido: number;
  orden_capa: number;
}

interface CapasContextType {
  layerDraft: Partial<Layer>;
  setLayerDraft: React.Dispatch<React.SetStateAction<Partial<Layer>>>;
  isSubmitting: boolean;
  handleAddLayer: () => Promise<void>;
  resetDraft: () => void;
  isAsideOpen: boolean;
  isAsideVisible: boolean;
  toggleAside: () => void;
}

const CapasContext = createContext<CapasContextType | undefined>(undefined);

export function CapasProvider({ children }: { children: React.ReactNode }) {
  const { selectedProject, fetchProjects } = useProyecto();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAsideOpen, setIsAsideOpen] = useState(false);
  const [isAsideVisible, setIsAsideVisible] = useState(false);
  const [layerDraft, setLayerDraft] = useState<Partial<Layer>>({
    name: "",
    description: "",
    longitud_util: 0,
    espesor: 0,
    coeficiente_rozamiento: 0,
    pines: 0,
    alfa_original: 0,
    alfa_corregido: 0,
    velocidad_de_alimentacion: 0,
    ancho: 0,
    ancho_eff: 0,
    NP: 0,
    patron_elegido: 0,
  });

  const API_BASE_URL = process.env.NEXT_PUBLIC_URL_BACKEND || "http://localhost:8000";

  const resetDraft = useCallback(() => {
    setLayerDraft({
      name: "",
      description: "",
      longitud_util: 0,
      espesor: 0,
      coeficiente_rozamiento: 0,
      pines: 0,
      alfa_original: 0,
      alfa_corregido: 0,
      velocidad_de_alimentacion: 0,
      ancho: 0,
      ancho_eff: 0,
      NP: 0,
      patron_elegido: 0,
    });
  }, []);

  const toggleAside = useCallback(() => {
    if (isAsideOpen) {
      setIsAsideOpen(false);
      setTimeout(() => setIsAsideVisible(false), 300);
    } else {
      setIsAsideVisible(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsAsideOpen(true));
      });
    }
  }, [isAsideOpen]);

  const handleAddLayer = useCallback(async () => {
    if (!selectedProject) {
      alert("No hay un proyecto seleccionado");
      return;
    }

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("auth_token");
      if (!token) throw new Error("No hay sesión activa");

      const response = await fetch(`${API_BASE_URL}/projects/${selectedProject.id}/layers/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(layerDraft),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || "Error al añadir capa");
      }

      alert("Capa añadida exitosamente");
      resetDraft();
      fetchProjects(); // Recargar proyectos para ver la nueva capa y progreso
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedProject, layerDraft, API_BASE_URL, fetchProjects, resetDraft]);

  return (
    <CapasContext.Provider value={{
      layerDraft,
      setLayerDraft,
      isSubmitting,
      handleAddLayer,
      resetDraft,
      isAsideOpen,
      isAsideVisible,
      toggleAside
    }}>
      {children}
    </CapasContext.Provider>
  );
}

export function useCapas() {
  const context = useContext(CapasContext);
  if (context === undefined) {
    throw new Error("useCapas must be used within a CapasProvider");
  }
  return context;
}
