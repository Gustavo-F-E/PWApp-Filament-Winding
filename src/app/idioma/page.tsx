"use client";

import React from 'react';
import MenuIdioma from '../components/MenuIdioma';
import IdiomaLogic from './IdiomaLogic';

function Idioma() {
  return (
    <IdiomaLogic>
      {({ t }) => (
        <section className="h-full w-full flex flex-col lg:grid lg:grid-rows-[repeat(23,1fr)] lg:grid-cols-[repeat(18,1fr)]">
            {/* menú superior interno */}
            <header className="hidden lg:block lg:row-[1/7] lg:col-[1/19] bg-blue-300">
                <MenuIdioma />
            </header>

            {/* contenido principal */}
            <main className="flex-1 w-full flex flex-col items-center lg:row-[7/24] lg:col-[1/13] bg-blue-50 lg:grid lg:grid-rows-[repeat(17,1fr)] lg:grid-cols-[repeat(12,1fr)] lg:h-full">
                <div
                    className="w-full max-w-xl mx-auto flex flex-col items-center overflow-auto lg:row-[1/18] lg:col-[1/13] py-10">
                    <p className="text-blue-950 w-[80%] lg:w-[60%] text-center text-fluid-lg">
                        {t("IdiomaPage.description")}
                    </p>
                    <p className="text-blue-950 w-[80%] lg:w-[60%] text-center  text-fluid-lg pt-10">
                        {t("IdiomaPage.description2")}
                    </p>
                    {/* Más contenido aquí */}
                </div>
            </main>

            {/* aside derecho */}
            <aside className="hidden lg:block lg:row-[7/24] lg:col-[13/19] bg-blue-100"></aside>
        </section>
      )}
    </IdiomaLogic>
  );
}

export default Idioma;