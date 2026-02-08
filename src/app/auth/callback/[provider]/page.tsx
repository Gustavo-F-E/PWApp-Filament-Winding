//src\app\auth\callback\[provider]\page.tsx


"use client";

import React from "react";
import MenuVacio from "@/app/components/MenuVacio";

// Protección global contra doble ejecución fuera del ciclo de vida del componente
declare global {
  var processedCodes: Set<string> | undefined;
}

import CallbackLogic from "./CallbackLogic";

export default function CallbackPage() {
  return (
    <section className="h-full w-full flex flex-col lg:grid lg:grid-rows-[repeat(23,1fr)] lg:grid-cols-[repeat(18,1fr)]">
      <CallbackLogic />
      {/* menú superior interno */}
      <header className="hidden lg:block lg:row-[1/7] lg:col-[1/19] bg-blue-300">
        {/* Aquí va el contenido del header */}
        <MenuVacio />
      </header>

      {/* Main */}
      <main className="flex-1 w-full lg:row-[7/24] lg:col-[1/13] bg-blue-50 lg:grid lg:grid-rows-[repeat(17,1fr)] lg:grid-cols-[repeat(12,1fr)] lg:h-full">
        <div className="lg:row-[1/18] lg:col-[1/13] flex items-center justify-center bg-white-50 h-full">
          <div className="text-center bg-white p-8 rounded-xl shadow-lg">
            <p className="text-xl font-semibold text-white-800">Autenticando...</p>
            <p className="text-white-500 mt-2 text-sm">Por favor, espera un momento.</p>
            <div className="mt-6 animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
          </div>
        </div>
      </main>

      {/* Aside */}
      <aside className="hidden lg:block lg:row-[7/24] lg:col-[13/19] bg-blue-100"></aside>
    </section>
  );
}
