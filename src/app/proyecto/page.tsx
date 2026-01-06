'use client';

import React, { useEffect, useState } from 'react';
import MenuProyecto from '../components/MenuProyecto'
import { useMobile } from '@/context/MobileContext';
import AsideProyecto from '../components/AsideProyecto';

function Proyecto() {
  const { setPageMenuContent, setLandscapeSidebarOpen } = useMobile();
  const [isAsideOpen, setIsAsideOpen] = useState(false);
  const [isAsideVisible, setIsAsideVisible] = useState(false);

  
  useEffect(() => {
    setPageMenuContent(<MenuProyecto mobileMode={true} />);
    setLandscapeSidebarOpen(true);
  }, [setPageMenuContent, setLandscapeSidebarOpen]);

  const toggleAside = () => {
    if (isAsideOpen) {
      // Iniciar animación de salida

      setIsAsideOpen(false);
      
      // Esperar a que termine la animación antes de ocultar
      setTimeout(() => {
        setIsAsideVisible(false);

      }, 300);
    } else {
      // Mostrar primero
      setIsAsideVisible(true);
      
      // Pequeño delay para asegurar que React renderice primero
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {

          setIsAsideOpen(true);
          
          setTimeout(() => {

          }, 300);
        });
      });
    }
  };

  return (
    <section className="h-full w-full flex flex-col lg:grid lg:grid-rows-[repeat(23,1fr)] lg:grid-cols-[repeat(18,1fr)] overflow-hidden">

      {/* Mobile Toggle Button con animación */}
      <div className="relative lg:hidden">
        <button
          className={`
            absolute top-[40vh] right-[0vw] landscape:top-[50vh] landscape:right-[0vw] 
            bg-blue-950 text-white p-2 rounded-l-md transform -translate-y-1/2 shadow-lg z-40 
            transition-all duration-300 ease-in-out
            ${isAsideOpen ? 'right-[90vw] landscape:right-[50vw]' : 'right-0'}
            hover:bg-blue-900 hover:scale-105 active:scale-95
          `}
          onClick={toggleAside}
        >
          <span className="block transform transition-transform duration-300">
            {isAsideOpen ? '>>' : '<<'}
          </span>
        </button>
      </div>

      {/* menú superior interno */}
      <header className="hidden lg:block lg:row-[1/7] lg:col-[1/19] bg-blue-300">
        <MenuProyecto/>
      </header>

      {/* contenido principal con animación de desplazamiento */}
      <main className={`
          flex-1 w-full lg:row-[7/24] lg:col-[1/13] bg-blue-50 lg:grid lg:grid-rows-[repeat(17,1fr)] lg:grid-cols-[repeat(12,1fr)] lg:h-full
          transition-all duration-300 ease-in-out overflow-hidden
          ${isAsideOpen ? 'lg:block' : 'block'}
          ${isAsideOpen ? 'transform -translate-x-[90vw] landscape:-translate-x-[50vw]' : 'translate-x-0'}
      `}>
        <div className="lg:row-[1/18] lg:col-[1/13] overflow-auto h-full">
          <p className="text-blue-950 px-4 pt-4">Proyecto</p>
          {/* Más contenido aquí */}
        </div>
      </main>

      {/* aside derecho con animación */}
      {isAsideVisible && (
        <div 
          className={`
            lg:hidden fixed inset-0 z-20
            transition-opacity duration-300 ease-in-out
            ${isAsideOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
          `}
          onClick={() => isAsideOpen && toggleAside()}
        >
          <aside 
            id="asideProyecto"
            className={`
              fixed right-0 top-[10vh] landscape:top-[0vh] h-full z-30 border-2 border-blue-200 bg-blue-100
              transform transition-transform duration-300 ease-in-out
              ${isAsideOpen ? 'translate-x-0' : 'translate-x-full'}
              w-[90vw] landscape:w-[75vw]
            `}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-full overflow-y-auto p-4">
              <AsideProyecto />
              {/* Más contenido del aside */}
            </div>
          </aside>
        </div>
      )}

      {/* aside derecho para desktop (sin cambios) */}
      <aside className="hidden lg:block lg:row-[7/24] lg:col-[13/19] bg-blue-100 lg:h-full">
          <AsideProyecto />
      </aside>

    </section>
  );
}

export default Proyecto;