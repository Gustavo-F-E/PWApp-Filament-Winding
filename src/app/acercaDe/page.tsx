'use client';

import React, { useEffect } from 'react';
import MenuAcercaDe from "../components/MenuAcercaDe";
import { useMobile } from '@/context/MobileContext';

function AcercaDe() {
  const { setPageMenuContent } = useMobile();

  useEffect(() => {
     setPageMenuContent(<MenuAcercaDe />);
  }, [setPageMenuContent]);

  return (
      <section className="h-full w-full flex flex-col lg:grid lg:grid-rows-[repeat(23,1fr)] lg:grid-cols-[repeat(18,1fr)]">
          {/* menú superior interno */}
          <header className="hidden lg:block lg:row-[1/7] lg:col-[1/19] bg-blue-300">
              {/* Aquí va el contenido del header */}
              <MenuAcercaDe />
          </header>

          {/* Main */}
          <main className="flex-1 w-full lg:row-[7/24] lg:col-[1/13] bg-blue-50 lg:grid lg:grid-rows-[repeat(17,1fr)] lg:grid-cols-[repeat(12,1fr)] lg:h-full">
              <div className="lg:row-[1/18] lg:col-[1/13] overflow-auto">
                  <p className="text-blue-950 px-4 pt-4">Acerca de</p>
                  {/* Más contenido */}
              </div>
          </main>

          {/* Aside */}
          <aside className="hidden lg:block lg:row-[7/24] lg:col-[13/19] bg-blue-100"></aside>
      </section>
  );
}

export default AcercaDe