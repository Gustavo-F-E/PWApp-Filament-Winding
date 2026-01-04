'use client';

import React, { useEffect, useState } from 'react';
import MenuProyecto from '../components/MenuProyecto'
import { useMobile } from '@/context/MobileContext';

function Proyecto() {
  const { setPageMenuContent } = useMobile();
  const [showAside, setShowAside] = useState(false);

  useEffect(() => {
     setPageMenuContent(<MenuProyecto mobileMode={true} />);
  }, [setPageMenuContent]);

  return (
    <section className="h-full w-full flex flex-col lg:grid lg:grid-rows-[repeat(23,1fr)] lg:grid-cols-[repeat(18,1fr)] relative">

      {/* Mobile Toggle Button */}
      <button
          className="lg:hidden fixed z-[45] top-1/2 right-0 bg-blue-950 text-white p-2 rounded-l-md transform -translate-y-1/2 shadow-lg"
          onClick={() => setShowAside(!showAside)}
      >
          {showAside ? '>>' : '<<'}
      </button>

      {/* menú superior interno */}
      <header className="hidden lg:block lg:row-[1/7] lg:col-[1/19] bg-blue-300">
        {/* Aquí va el contenido del header */}
        <MenuProyecto/>
      </header>

      {/* contenido principal */}
      <main className={`
          flex-1 w-full lg:row-[7/24] lg:col-[1/13] bg-blue-50 lg:grid lg:grid-rows-[repeat(17,1fr)] lg:grid-cols-[repeat(12,1fr)] lg:h-full
          ${showAside ? 'hidden' : 'block'}
          lg:block
      `}>
        <p className="text-blue-950 px-4 pt-4">Proyecto</p>
        
      </main>

      {/* aside derecho */}
      <aside className={`
           lg:row-[7/24] lg:col-[13/19] bg-blue-100 lg:h-full
           ${showAside ? 'block w-full flex-1' : 'hidden'}
           lg:block
      `}>
        
      </aside>

    </section>
  );
}

export default Proyecto