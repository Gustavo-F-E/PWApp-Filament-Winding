'use client';

import React, { useEffect, useState } from 'react';
import MenuCapas from '../components/MenuCapas'
import { useMobile } from '@/context/MobileContext';

function Capas() {
  const { setPageMenuContent, setLandscapeSidebarOpen } = useMobile();
  const [isAsideOpen, setIsAsideOpen] = useState(false);
  
  useEffect(() => {
     setPageMenuContent(<MenuCapas mobileMode={true} />);
     setLandscapeSidebarOpen(true);
  }, [setPageMenuContent, setLandscapeSidebarOpen]);

  return (
    <section className="h-full w-full flex flex-col lg:grid lg:grid-rows-[repeat(23,1fr)] lg:grid-cols-[repeat(18,1fr)] relative">

      {/* Mobile Toggle Button - Visible in Landscape Mobile and Portrait Mobile if needed */}
      {/* Requirement: "el aside se muestra cuando se aprieta un boton '<<' y se oculta de nuevo..." */}
      
      {/* PORTRAIT MOBILE TOGGLE (Existing) -> We might need to keep this if portrait logic stays same */}
      {/* LANDSCAPE MOBILE TOGGLE -> Controls context state */}
      
      <button
          className="lg:hidden fixed z-[45] top-1/2 right-[2vw] landscape:right-[22vw] bg-blue-950 text-white p-2 rounded-l-md transform -translate-y-1/2 shadow-lg"
          onClick={() => setIsAsideOpen(!isAsideOpen)}
      >
          {isAsideOpen ? '>>' : '<<'}
      </button>

      {/* menú superior interno */}
      <header className="hidden lg:block lg:row-[1/7] lg:col-[1/19] bg-blue-300">
        {/* Aquí va el contenido del header */}
        <MenuCapas/>
      </header>

      {/* contenido principal */}
      <main className={`
          flex-1 w-full lg:row-[7/24] lg:col-[1/13] bg-blue-50 lg:grid lg:grid-rows-[repeat(17,1fr)] lg:grid-cols-[repeat(12,1fr)] lg:h-full
          ${isAsideOpen ? 'hidden lg:block' : 'block'}
      `}>
        <p className="text-blue-950 px-4 pt-4">Capas</p>
        
      </main>

       {/* aside derecho DESKTOP ONLY - Mobile landscape handled by wrapper */}
        <aside id="asideCapas" className={`
             lg:row-[7/24] lg:col-[13/19] bg-blue-100 lg:h-full
             lg:block
             ${isAsideOpen ? 'block fixed right-0 top-[10vh] w-[90vw] landscape:right-[20vw] landscape:w-[50vw] landscape:top-0 h-full z-30 border-2 border-blue-200' : 'hidden'}
        `}>
        <h2 className='text-blue-950 px-4 pt-4'>aside capas</h2>
      </aside>

    </section>
  );
}

export default Capas