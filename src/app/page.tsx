'use client'

import Image from "next/image";
import MenuHome from './components/MenuHome'
import {FillWindPathIcon } from './components/IconosSVG';
import { useIdioma } from '@/context/IdiomaContext';

function Home() {
  const { t } = useIdioma();

  return (
    <section className="h-full w-full grid grid-rows-[repeat(23,1fr)] grid-cols-[repeat(18,1fr)]">

      {/* menú superior interno */}
      <header className="row-[1/7] col-[1/19] bg-blue-300">
        <MenuHome/>
      </header>

      {/* contenido principal */}
      <main className="row-[7/24] col-[1/13] bg-blue-50 grid grid-rows-[repeat(17,1fr)] grid-cols-[repeat(12,1fr)] h-full w-full">
        
        {/* Párrafo 1 - Descripción */}
        <p className="row-[3/7] col-[3/11] text-blue-950 text-center text-lg">
          <span className="font-bold">Fildwind</span> &nbsp;
          <FillWindPathIcon 
            className="inline-block w-[1.5em] h-[1.5em] align-middle" 
            colorClass="#000000" 
          /> 
          &nbsp;{t('HomePage.description')}
        </p>
        
        {/* Icono de alerta */}
        <p className="row-[7/9] col-[3/11] flex items-center justify-center">
          <Image
            src="/images/icons/alert.svg"
            alt={t('HomePage.alertAlt')}
            width={40}
            height={40}
            className="inline-block"
          /> 
        </p>
        
        {/* Párrafo 2 - Instrucciones */}
        <p className="row-[9/11] col-[3/11] text-blue-950 text-center text-lg">
          {t('HomePage.toStart')} <span className="font-bold">Fildwind</span> &nbsp;
          
          <FillWindPathIcon 
            className="inline-block w-[1.5em] h-[1.5em] align-middle" 
            colorClass="#000000" 
          />
          
          &nbsp;{t('HomePage.recommendation')}
          <br />
          {t('HomePage.andToView')}
        </p>
        
      </main>

      {/* aside derecho */}
      <aside className="row-[7/24] col-[13/19] bg-blue-100">
        {/* Puedes añadir contenido traducible aquí también */}
      </aside>

    </section>
  );
}


export default Home