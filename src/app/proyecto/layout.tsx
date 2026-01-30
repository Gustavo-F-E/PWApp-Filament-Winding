//src\app\proyecto\layout.tsx

"use client";

import React, { useEffect } from "react";
import MenuProyecto from "./MenuProyecto";
import { useProyecto } from "./ProyectoContext";
import { useMobile } from "@/context/MobileContext";

export default function ProyectoLayout({
  children,
  main,
  aside,
}: {
  children: React.ReactNode;
  main: React.ReactNode;
  aside: React.ReactNode;
}) {
  const { setPageMenuContent, setLandscapeSidebarOpen } = useMobile();

  useEffect(() => {
    setPageMenuContent(<MenuProyecto mobileMode={true} />);
    setLandscapeSidebarOpen(true);
  }, [setPageMenuContent, setLandscapeSidebarOpen]);

  return (
    <LayoutContent main={main} aside={aside}>
      {children}
    </LayoutContent>
  );
}

function LayoutContent({
  main,
  aside,
  children
}: {
  main: React.ReactNode;
  aside: React.ReactNode;
  children: React.ReactNode;
}) {
  const { isAsideOpen, isAsideVisible, toggleAside } = useProyecto();

  return (
    <section className="h-full w-full flex flex-col lg:grid lg:grid-rows-[repeat(23,1fr)] lg:grid-cols-[repeat(18,1fr)] overflow-hidden">
      {/* Mobile Toggle Button */}
      <div className="relative lg:hidden">
        <button
          className={`
            absolute top-[40vh] right-[0vw] landscape:top-[50vh] landscape:right-[0vw] 
            bg-blue-950 text-white p-2 rounded-l-md transform -translate-y-1/2 shadow-lg z-40 
            transition-all duration-300 ease-in-out
            ${isAsideOpen ? "right-[90vw] landscape:right-[50vw]" : "right-0"}
            hover:bg-blue-900 hover:scale-105 active:scale-95
          `}
          onClick={toggleAside}
        >
          <span className="block transform transition-transform duration-300">
            {isAsideOpen ? ">>" : "<<"}
          </span>
        </button>
      </div>

      {/* menú superior interno */}
      <header className="hidden lg:block lg:row-[1/7] lg:col-[1/19] bg-blue-300">
        <MenuProyecto />
      </header>

      {/* contenido principal (Slot @main) */}
      <main
        className={`
          flex-1 w-full lg:row-[7/24] lg:col-[1/13] bg-blue-50 lg:grid lg:grid-cols-[repeat(12,1fr)] lg:h-full lg:min-h-0
          transition-all duration-300 ease-in-out overflow-hidden
          ${isAsideOpen ? "lg:block" : "block"}
          ${isAsideOpen
            ? "transform -translate-x-[90vw] landscape:-translate-x-[50vw]"
            : "translate-x-0"
          }
      `}
      >
        {main}
      </main>

      {/* aside derecho para mobile (Slot @aside) */}
      {isAsideVisible && (
        <div
          className={`
            lg:hidden fixed inset-0 z-20
            transition-opacity duration-300 ease-in-out
            ${isAsideOpen ? "opacity-100" : "opacity-0 pointer-events-none"}
          `}
          onClick={() => isAsideOpen && toggleAside()}
        >
          <aside
            id="asideProyecto"
            className={`
              fixed right-0 top-[10vh] landscape:top-[0vh] h-full z-30 border-2 border-blue-200 bg-blue-100
              transform transition-transform duration-300 ease-in-out
              ${isAsideOpen ? "translate-x-0" : "translate-x-full"}
              w-[90vw] landscape:w-[75vw]
            `}
            onClick={(e) => e.stopPropagation()}
          >
            {aside}
          </aside>
        </div>
      )}

      {/* aside derecho para desktop (Slot @aside) */}
      <aside className="hidden lg:block lg:row-[7/24] lg:col-[13/19] bg-blue-100 lg:h-full">
        {aside}
      </aside>

      <div className="hidden">{children}</div>
    </section>
  );
}
