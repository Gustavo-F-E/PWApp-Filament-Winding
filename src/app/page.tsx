'use client'

import React, { useEffect } from 'react';
import Image from "next/image";
import MenuHome from './components/MenuHome'
import {FillWindPathIcon } from './components/IconosSVG';
import { useIdioma } from '@/context/IdiomaContext';
import { useMobile } from '@/context/MobileContext';

function Home() {
  const { t } = useIdioma();
  const { setPageMenuContent } = useMobile();

  useEffect(() => {
     setPageMenuContent(<MenuHome mobileMode={true} />);
  }, [setPageMenuContent]);

  return (
      <section className="h-full w-full flex flex-col lg:grid lg:grid-rows-[repeat(23,1fr)] lg:grid-cols-[repeat(18,1fr)]">
          {/* menú superior interno - Oculto en móbile */}
          <header className="hidden lg:block lg:row-[1/7] lg:col-[1/19] bg-blue-300">
              <MenuHome />
          </header>

          {/* contenido principal - Móbile: flex-1 o auto */}
          <main className="flex-1 w-full lg:row-[7/24] lg:col-[1/13] bg-blue-50 lg:grid  lg:grid-cols-[repeat(12,1fr)] lg:h-full lg:min-h-0 py-10 lg:py-0">
              <div className="flex-1 overflow-y-auto col-[1/13] lg:col-[3/11] lg:grid lg:grid-rows-[repeat(17,1fr)]">
                  {/* Párrafo 1 - Descripción */}
                  <div className="row-[3/7]  text-blue-950 text-center px-4 flex flex-col justify-center">
                      <div className="text-fluid-base">
                          <span className="font-bold">Fildwind</span>
                          <span className="inline-block align-middle w-[1.3em] h-[1.3em] mx-1">
                              <FillWindPathIcon
                                  className="w-full h-full"
                                  colorClass="#000000"
                              />
                          </span>
                          <span>{t("HomePage.description")}</span>
                      </div>
                  </div>

                  {/* Icono de alerta */}
                  <div className="row-[7/9] flex items-center justify-center">
                      <div className="relative w-[10%] h-[10%] min-w-16 min-h-16 max-w-24 max-h-24">
                          <Image
                              src="/images/icons/alert.svg"
                              alt={t("HomePage.alertAlt")}
                              fill={true} // Ocupa todo el contenedor
                              className="object-contain"
                          />
                      </div>
                  </div>

                  {/* Párrafo 2 - Instrucciones */}
                  <div className="row-[9/13] text-blue-950 text-center px-4 flex flex-col justify-center text-fluid-base">
                      <div>
                          <span>{t("HomePage.toStart")}&nbsp;</span>
                          <span className="font-bold">Fildwind</span>
                          <span className="inline-block align-middle w-[1.3em] h-[1.3em] mx-1">
                              <FillWindPathIcon
                                  className="w-full h-full"
                                  colorClass="#000000"
                              />
                          </span>
                          <span>
                              &nbsp;{t("HomePage.recommendation")}&nbsp;
                          </span>
                          <br></br>
                          <span className="underline">
                              {t("HomePage.tourLink")}
                          </span>
                          <span>&nbsp;{t("HomePage.andToView")}&nbsp;</span>
                          <br></br>
                          <span className="underline">
                              {t("HomePage.loginLink")}.
                          </span>
                      </div>
                  </div>
              </div>
          </main>

          {/* aside derecho - Oculto en móbile */}
          <aside className="hidden lg:block lg:row-[7/24] lg:col-[13/19] bg-blue-100">
              {/* Puedes añadir contenido traducible aquí también */}
          </aside>
      </section>
  );
}


export default Home