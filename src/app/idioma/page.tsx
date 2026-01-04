'use client'

import React, { useEffect } from 'react';
import MenuIdioma from '../components/MenuIdioma';
import { useIdioma } from '@/context/IdiomaContext';
import { useMobile } from '@/context/MobileContext';

function Idioma() {
  const { t } = useIdioma();
  const { setPageMenuContent } = useMobile();

  useEffect(() => {
     setPageMenuContent(<MenuIdioma mobileMode={true} />);
  }, [setPageMenuContent]);

  return (
    <section className="h-full w-full flex flex-col lg:grid lg:grid-rows-[repeat(23,1fr)] lg:grid-cols-[repeat(18,1fr)]">

      {/* menú superior interno */}
      <header className="hidden lg:block lg:row-[1/7] lg:col-[1/19] bg-blue-300">
        <MenuIdioma />
      </header>

      {/* contenido principal */}
      <main className="flex-1 w-full lg:row-[7/24] lg:col-[1/13] bg-blue-50 flex flex-col items-center justify-center lg:h-full text-blue-950">
        <p className="text-blue-950 w-[80%] lg:w-[60%] text-center text-fluid-lg">{t('IdiomaPage.description')}</p>
        <p className="text-blue-950 w-[80%] lg:w-[60%] text-center  text-fluid-lg pt-10">{t('IdiomaPage.description2')}</p>
      </main>

      {/* aside derecho */}
      <aside className="hidden lg:block lg:row-[7/24] lg:col-[13/19] bg-blue-100">
        
      </aside>

    </section>
  );
}

export default Idioma;