'use client'

import MenuIdioma from '../components/MenuIdioma';
import { useIdioma } from '@/context/IdiomaContext';

function Idioma() {
  const { t } = useIdioma();

  return (
    <section className="h-full w-full grid grid-rows-[repeat(23,1fr)] grid-cols-[repeat(18,1fr)]">

      {/* menú superior interno */}
      <header className="row-[1/7] col-[1/19] bg-blue-300">
        <MenuIdioma />
      </header>

      {/* contenido principal */}
      <main className="row-[7/24] col-[1/13] bg-blue-50 flex flex-col items-center justify-center h-full w-full text-blue-950">
        <p className="text-blue-950 w-[60%] text-center text-lg">{t('IdiomaPage.description')}</p>
        <p className="text-blue-950 w-[60%] text-center  text-lg pt-10">{t('IdiomaPage.description2')}</p>
      </main>

      {/* aside derecho */}
      <aside className="row-[7/24] col-[13/19] bg-blue-100">
        
      </aside>

    </section>
  );
}

export default Idioma;