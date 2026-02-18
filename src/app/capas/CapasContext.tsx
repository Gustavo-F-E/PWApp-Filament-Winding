"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { useProyecto } from "../proyecto/ProyectoContext";
import { getCurrentLocation } from "@/utils/geolocation";

export interface Layer {
  id?: string;
  name: string;
  description: string;
  material_name?: string;
  longitud_util: number;
  pines: number;
  corregir_angulo: boolean;
  alfa_original: number;
  alfa_corregido: number;
  velocidad_de_alimentacion: number;
  ancho_eff: number;
  NP: number;
  patron_elegido: number;
  orden_capa: number;
  is_system?: boolean;
  system_vueltas?: number;
  calculos_iniciales?: any;
  patron_elegido_data?: any;
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
  // Shared Pattern state
  generatedPatterns: string[];
  setGeneratedPatterns: React.Dispatch<React.SetStateAction<string[]>>;
  thumbnails: string[];
  setThumbnails: React.Dispatch<React.SetStateAction<string[]>>;
  currentNP: number | null;
  setCurrentNP: React.Dispatch<React.SetStateAction<number | null>>;
  calculosIniciales: any;
  setCalculosIniciales: React.Dispatch<React.SetStateAction<any>>;
  diccionarioCapa: any;
  setDiccionarioCapa: React.Dispatch<React.SetStateAction<any>>;
  selectedPatternIndex: number | null;
  setSelectedPatternIndex: React.Dispatch<React.SetStateAction<number | null>>;
  handleSeeDetail: (index: number) => Promise<{ plot_svg: string, patternData: any } | null>;
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
    material_name: "",
    longitud_util: 0,
    pines: 0,
    corregir_angulo: false,
    alfa_original: 0,
    alfa_corregido: 0,
    velocidad_de_alimentacion: 0,
    ancho_eff: 0,
    NP: 0,
    patron_elegido: 0,
    calculos_iniciales: null,
    patron_elegido_data: null,
  });

  // Shared Pattern state
  const [generatedPatterns, setGeneratedPatterns] = useState<string[]>([]);
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const [currentNP, setCurrentNP] = useState<number | null>(null);
  const [calculosIniciales, setCalculosIniciales] = useState<any>(null);
  const [diccionarioCapa, setDiccionarioCapa] = useState<any>(null);
  const [selectedPatternIndex, setSelectedPatternIndex] = useState<number | null>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_URL_BACKEND || "http://localhost:8000";

  const resetDraft = useCallback(() => {
    setLayerDraft({
      name: "",
      description: "",
      material_name: "",
      longitud_util: 0,
      pines: 0,
      corregir_angulo: false,
      alfa_original: 0,
      alfa_corregido: 0,
      velocidad_de_alimentacion: 0,
      ancho_eff: 0,
      NP: 0,
      patron_elegido: 0,
      calculos_iniciales: null,
      patron_elegido_data: null,
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

      const location = await getCurrentLocation();
      const response = await fetch(`${API_BASE_URL}/layers/?project_id=${selectedProject.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ ...layerDraft, location }),
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
  }, [selectedProject, layerDraft, API_BASE_URL, fetchProjects, resetDraft, fetchLayers]);

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

  const handleReorderLayer = useCallback(async (projectId: string, fromUIIndex: number, toUIIndex: number) => {
    try {
      // Mapear índices de la UI (que incluyen virtuales) a índices reales (solo físicas)
      const physicalLayers = layers.filter(l => !l.is_system);
      const fromLayer = layers[fromUIIndex];
      const toLayer = layers[toUIIndex];

      if (!fromLayer || !toLayer || fromLayer.is_system || toLayer.is_system) {
        console.warn("Intento de reordenar capas inválidas o de sistema");
        return;
      }

      const fromIndex = physicalLayers.indexOf(fromLayer);
      const toIndex = physicalLayers.indexOf(toLayer);

      if (fromIndex === -1 || toIndex === -1) {
        throw new Error("No se pudieron encontrar las capas físicas correspondientes");
      }

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
  }, [API_BASE_URL, fetchProjects, fetchLayers, layers]);

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

  const handleSeeDetail = useCallback(async (index: number) => {
    if (!diccionarioCapa) return null;

    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch(`${API_BASE_URL}/calculations/pattern-detail`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          diccionario_capa: diccionarioCapa,
          patron_index: index
        })
      });

      if (response.ok) {
        const data = await response.json();
        return {
          plot_svg: data.plot_svg,
          patternData: data.patron_elegido_data
        };
      } else {
        alert("Error al obtener detalle del patrón");
        return null;
      }
    } catch (error) {
      console.error("Error fetching detail:", error);
      alert("Error de conexión");
      return null;
    }
  }, [diccionarioCapa, API_BASE_URL]);

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
      fetchLayers,
      generatedPatterns,
      setGeneratedPatterns,
      thumbnails,
      setThumbnails,
      currentNP,
      setCurrentNP,
      calculosIniciales,
      setCalculosIniciales,
      diccionarioCapa,
      setDiccionarioCapa,
      selectedPatternIndex,
      setSelectedPatternIndex,
      handleSeeDetail
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
