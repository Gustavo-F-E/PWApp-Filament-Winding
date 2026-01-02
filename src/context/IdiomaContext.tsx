// context/IdiomaContext.tsx
'use client'

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Tipos de idioma soportados
type Idioma = 'es' | 'en' | 'de' | 'pt';

// Define la estructura base de traducciones
interface TraduccionesBase {
  IdiomaPage?: {
    title?: string;
    description?: string;
  };
  Navigation?: {
    home?: string;
    project?: string;
    layers?: string;
    help?: string;
    about?: string;
    contact?: string;
    language?: string;
  };
  LanguageOptions?: {
    english?: string;
    spanish?: string;
    german?: string;
    portuguese?: string;
  };
  Auth?: {
    login?: string;
    logout?: string;
    register?: string;
    noAccount?: string;
  };
}

// Tipo para traducciones completas (puede tener propiedades adicionales)
type Traducciones = TraduccionesBase & Record<string, string | Record<string, string>>;

// Tipo del contexto
interface IdiomaContextType {
  idioma: Idioma;
  setIdioma: (idioma: Idioma) => Promise<void>;
  t: (clave: string) => string;
  traducciones: Traducciones;
}

// Contexto
const IdiomaContext = createContext<IdiomaContextType | undefined>(undefined);

// Cargar traducciones con importación dinámica tipada
const cargarTraducciones = async (idioma: Idioma): Promise<Traducciones> => {
  try {
    // Importación dinámica con tipo explícito
    const modulo: { default: Traducciones } = await import(`../../traducciones/${idioma}.json`);
    return modulo.default;
  } catch (error) {
    console.error(`Error cargando traducciones para ${idioma}:`, error);
    // Fallback a español
    try {
      const modulo: { default: Traducciones } = await import(`../../traducciones/es.json`);
      return modulo.default;
    } catch (fallbackError) {
      console.error('Error cargando fallback español:', fallbackError);
      return {} as Traducciones; // Retorna objeto vacío tipado
    }
  }
};

// Función auxiliar para obtener valor anidado de forma segura
const obtenerValorAnidado = (obj: unknown, clave: string): string => {
  if (!obj || typeof obj !== 'object') {
    return `[${clave}]`;
  }
  
  const partes = clave.split('.');
  let valor: unknown = obj;
  
  for (const parte of partes) {
    if (valor && typeof valor === 'object' && parte in (valor as object)) {
      valor = (valor as Record<string, unknown>)[parte];
    } else {
      return `[${clave}]`;
    }
  }
  
  return typeof valor === 'string' ? valor : `[${clave}]`;
};

// Proveedor
export function IdiomaProvider({ children }: { children: ReactNode }) {
  const [idioma, setIdioma] = useState<Idioma>('es');
  const [traducciones, setTraducciones] = useState<Traducciones>({} as Traducciones);
  const [isLoading, setIsLoading] = useState(true);

  // Función para cambiar idioma
  const cambiarIdioma = async (nuevoIdioma: Idioma): Promise<void> => {
    setIsLoading(true);
    try {
      const nuevasTraducciones = await cargarTraducciones(nuevoIdioma);
      setTraducciones(nuevasTraducciones);
      setIdioma(nuevoIdioma);
      
      // Guardar en localStorage para persistencia
      if (typeof window !== 'undefined') {
        localStorage.setItem('idioma-preferido', nuevoIdioma);
      }
    } catch (error) {
      console.error('Error cambiando idioma:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para obtener traducción
  const t = (clave: string): string => {
    if (isLoading) {
      return '...';
    }
    return obtenerValorAnidado(traducciones, clave);
  };

  // Cargar idioma guardado al inicio
  useEffect(() => {
    const cargarIdiomaGuardado = async (): Promise<void> => {
      setIsLoading(true);
      let idiomaInicial: Idioma = 'es';
      
      try {
        if (typeof window !== 'undefined') {
          const guardado = localStorage.getItem('idioma-preferido');
          if (guardado && (guardado === 'es' || guardado === 'en' || guardado === 'de' || guardado === 'pt')) {
            idiomaInicial = guardado as Idioma;
          }
        }
        
        const trad = await cargarTraducciones(idiomaInicial);
        setTraducciones(trad);
        setIdioma(idiomaInicial);
      } catch (error) {
        console.error('Error cargando idioma guardado:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    cargarIdiomaGuardado();
  }, []);

  const contextValue: IdiomaContextType = {
    idioma,
    setIdioma: cambiarIdioma,
    t,
    traducciones
  };

  return (
    <IdiomaContext.Provider value={contextValue}>
      {children}
    </IdiomaContext.Provider>
  );
}

// Hook para usar el contexto
export function useIdioma(): IdiomaContextType {
  const context = useContext(IdiomaContext);
  if (!context) {
    throw new Error('useIdioma debe usarse dentro de IdiomaProvider');
  }
  return context;
}