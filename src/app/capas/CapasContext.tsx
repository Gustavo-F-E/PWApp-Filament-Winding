"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { useProyecto } from "../proyecto/ProyectoContext";

export interface Layer {
  id?: string;
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
  is_system?: boolean;
  system_vueltas?: number;
}

interface CapasContextType {
  layerDraft: Partial<Layer>;
  setLayerDraft: React.Dispatch<React.SetStateAction<Partial<Layer>>>;
  editingLayer: Layer | null;
  setEditingLayer: React.Dispatch<React.SetStateAction<Layer | null>>;
  isSubmitting: boolean;
  handleAddLayer: () => Promise<void>;
  handleUpdateLayer: (layerId: string, data: Partial<Layer>) => Promise<void>;
  handleDeleteLayer: (layerId: string) => Promise<void>;
  handleReorderLayer: (projectId: string, fromIndex: number, toIndex: number) => Promise<void>;
  resetDraft: () => void;
  isAsideOpen: boolean;
  isAsideVisible: boolean;
  toggleAside: () => void;
  isEditingOrder: boolean;
  setIsEditingOrder: React.Dispatch<React.SetStateAction<boolean>>;
  handleBulkReorder: (project_id: string, layerIds: string[]) => Promise<void>;
  layers: Layer[];
  fetchLayers: () => Promise<void>;
}

const CapasContext = createContext<CapasContextType | undefined>(undefined);

export function CapasProvider({ children }: { children: React.ReactNode }) {
  const { selectedProject, fetchProjects } = useProyecto();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAsideOpen, setIsAsideOpen] = useState(false);
  const [isAsideVisible, setIsAsideVisible] = useState(false);
  const [isEditingOrder, setIsEditingOrder] = useState(false);
  const [editingLayer, setEditingLayer] = useState<Layer | null>(null);
  const [layers, setLayers] = useState<Layer[]>([]);
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

  const fetchLayers = useCallback(async () => {
    if (!selectedProject) {
      setLayers([]);
      return;
    }
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/layers/project/${selectedProject.id}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        // Map _id to id if necessary
        setLayers(data.map((l: any) => ({ ...l, id: l.id || l._id })));
      }
    } catch (err) {
      console.error("Error fetching layers:", err);
    }
  }, [selectedProject, API_BASE_URL]);

  React.useEffect(() => {
    fetchLayers();
  }, [fetchLayers]);

  const handleAddLayer = useCallback(async () => {
    if (!selectedProject) {
      alert("No hay un proyecto seleccionado");
      return;
    }

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("auth_token");
      if (!token) throw new Error("No hay sesión activa");

      const response = await fetch(`${API_BASE_URL}/layers/?project_id=${selectedProject.id}`, {
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
      fetchLayers(); // Refresh local layers
      fetchProjects(); // Recargar proyectos para ver progreso en la lista
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedProject, layerDraft, API_BASE_URL, fetchProjects, resetDraft]);

  const handleUpdateLayer = useCallback(async (layerId: string, data: Partial<Layer>) => {
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("auth_token");
      if (!token) throw new Error("No hay sesión activa");

      const response = await fetch(`${API_BASE_URL}/layers/${layerId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || "Error al actualizar capa");
      }

      alert("Capa actualizada correctamente");
      fetchLayers();
      fetchProjects();
      setEditingLayer(null);
      if (isAsideOpen) toggleAside();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setIsSubmitting(false);
    }
  }, [API_BASE_URL, fetchProjects, isAsideOpen, toggleAside, fetchLayers]);

  const handleDeleteLayer = useCallback(async (layerId: string) => {
    if (!confirm("¿Estás seguro de eliminar esta capa?")) return;

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("auth_token");
      if (!token) throw new Error("No hay sesión activa");

      const response = await fetch(`${API_BASE_URL}/layers/${layerId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || "Error al eliminar capa");
      }

      fetchLayers();
      fetchProjects();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setIsSubmitting(false);
    }
  }, [API_BASE_URL, fetchProjects, fetchLayers]);

  const handleReorderLayer = useCallback(async (projectId: string, fromIndex: number, toIndex: number) => {
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("auth_token");
      if (!token) throw new Error("No hay sesión activa");

      const response = await fetch(`${API_BASE_URL}/layers/reorder/${projectId}?from_index=${fromIndex}&to_index=${toIndex}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || "Error al reordenar capas");
      }

      fetchLayers();
      fetchProjects();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setIsSubmitting(false);
    }
  }, [API_BASE_URL, fetchProjects, fetchLayers]);

  const handleBulkReorder = useCallback(async (projectId: string, layerIds: string[]) => {
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("auth_token");
      if (!token) throw new Error("No hay sesión activa");

      const response = await fetch(`${API_BASE_URL}/layers/bulk-reorder/${projectId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ layer_ids: layerIds }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || "Error al reordenar capas masivamente");
      }

      alert("Orden de capas actualizado correctamente");
      fetchLayers();
      fetchProjects();
      setIsEditingOrder(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setIsSubmitting(false);
    }
  }, [API_BASE_URL, fetchProjects, fetchLayers]);

  return (
    <CapasContext.Provider value={{
      layerDraft,
      setLayerDraft,
      editingLayer,
      setEditingLayer,
      isSubmitting,
      handleAddLayer,
      handleUpdateLayer,
      handleDeleteLayer,
      handleReorderLayer,
      handleBulkReorder,
      resetDraft,
      isAsideOpen,
      isAsideVisible,
      toggleAside,
      isEditingOrder,
      setIsEditingOrder,
      layers,
      fetchLayers
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
