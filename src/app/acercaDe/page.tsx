'use client';

import React, { useEffect } from 'react';
import MenuVacio from '../components/MenuVacio'
import { useMobile } from '@/context/MobileContext';

function AcercaDe() {
  const { setPageMenuContent } = useMobile();

  useEffect(() => {
     setPageMenuContent(<MenuVacio />); // MenuVacio might not accept mobileMode but it's empty anyway
  }, [setPageMenuContent]);

  return (
      <section className="h-full w-full flex flex-col min-h-0 overflow-hidden">
          {/* menú superior interno */}
          <header className="hidden lg:block h-[25vh] bg-blue-300">
              {/* Aquí va el contenido del header */}
              <MenuVacio />
          </header>

          {/* Zona inferior que ocupa TODO el resto */}
          <div className="flex-1 w-full flex min-h-0 overflow-hidden">
              {/* Main */}
              <main className="flex-1 bg-blue-50 min-h-0 overflow-hidden">
                  <div className="h-full w-full overflow-y-auto">
                      <p className="text-blue-950 px-4 pt-4">Acerca de</p>
                      {/* Más contenido */}
                  </div>
              </main>

              {/* Aside */}
              <aside className="hidden lg:block w-[30%] bg-blue-100"></aside>
          </div>
      </section>
  );
}

export default AcercaDe