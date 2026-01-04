'use client';

import React, { useState } from 'react';
import { HomeIcon, FillWindPathIcon } from './IconosSVG'; // Adjust imports as needed
import UserBadge from './UserBadge';
import { useMobile } from '@/context/MobileContext';
import NavItem from './NavItems';
import { 
    ProyectoIcon, 
    CapasIcon, 
    AyudaIcon, 
    AcercaDeIcon, 
    ContactoIcon, 
    IdiomaIcon 
} from './IconosSVG';
import BotonSesion from './BotonSesion';
import TranslatedFooter from './TranslatedFooter';

export default function MobileLayoutWrapper({ 
  children,
  desktopHeader,
  desktopAside,
  desktopFooter,
  desktopUserBadge
}: { 
  children: React.ReactNode,
  desktopHeader: React.ReactNode,
  desktopAside: React.ReactNode,
  desktopFooter: React.ReactNode,
  desktopUserBadge: React.ReactNode
}) {
  const { togglePageMenu, isPageMenuOpen, pageMenuContent, closePageMenu } = useMobile();
  const [isGlobalNavOpen, setIsGlobalNavOpen] = useState(false);

  const toggleGlobalNav = () => setIsGlobalNavOpen(!isGlobalNavOpen);

  return (
    <div className="contents">
        {/* --- DESKTOP LAYOUT (Hidden on mobile) --- */}
        <div className="hidden lg:contents">
            {desktopHeader}
            {desktopAside}
            <main className="row-[1/24] col-[7/25] h-full overflow-hidden">
                <div className="h-full w-full">{children}</div>
            </main>
            {desktopUserBadge}
            {desktopFooter}
        </div>

        {/* --- MOBILE LAYOUT (Hidden on large screens) --- */}
        <div className="lg:hidden fixed inset-0 flex flex-col bg-blue-50">
            
            {/* FIXED TOP BAR (10% height) */}
            <header className="h-[10%] bg-blue-950 flex items-center px-4 shrink-0 z-40">
                 <div className="w-1/4 h-full flex items-center justify-start py-2">
                    <FillWindPathIcon className="h-full w-auto max-h-12" colorClass="var(--white-950)" />
                 </div>
                 <div className="w-3/4 flex justify-end">
                    <h1 className="text-white font-bold text-fluid-lg truncate">
                        Filament Path Generator
                    </h1>
                 </div>
            </header>

            {/* MAIN CONTENT (Scrollable) */}
            <main className="flex-1 overflow-y-auto overflow-x-hidden relative w-full">
                {children}
                
                {/* Footer only visible at bottom of scroll */}
                 <footer className="bg-red-100 text-red-950 text-center py-4 mt-auto">
                    <div className="flex items-center justify-center">
                        <TranslatedFooter />
                    </div>
                </footer>
            </main>

            {/* PAGE MENU MODAL (Left Sidebar) */}
            {/* Rendered to be z-indexed below the bottom bar (z-50) but above content */}
            {isPageMenuOpen && pageMenuContent && (
                <div className="fixed inset-0 z-40 bg-black bg-opacity-50 flex justify-start lg:hidden" onClick={closePageMenu} style={{ paddingBottom: '10%' }}>
                     <div 
                        className="w-[80%] h-full bg-blue-300 p-4 text-blue-950 overflow-y-auto shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {pageMenuContent}
                    </div>
                </div>
            )}


            {/* FIXED BOTTOM BAR (10% height) */}
            <nav className="h-[10%] bg-blue-950 flex items-center justify-between px-6 shrink-0 z-50">
                {/* LEFT: Page Menu Hamburger (3 lines) */}
                 <button onClick={togglePageMenu} className="p-2 text-white bg-transparent z-[60]">
                    {isPageMenuOpen ? (
                        <span className="text-xl font-bold">X</span>
                    ) : (
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="3" y1="12" x2="21" y2="12"></line>
                            <line x1="3" y1="6" x2="21" y2="6"></line>
                            <line x1="3" y1="18" x2="21" y2="18"></line>
                        </svg>
                    )}
                 </button>

                {/* CENTER: User Badge (Icon Only) */}
                <div className="flex-1 px-4 flex justify-center h-full py-2">
                    <UserBadge mobileMode={true} />
                </div>

                {/* RIGHT: Global Nav (Home Icon) */}
                <button onClick={toggleGlobalNav} className="p-2 text-white">
                    <HomeIcon className="w-8 h-8" colorClass="var(--white-50)" />
                </button>
            </nav>

            {/* GLOBAL NAV DRAWER (Right Side - Full Width) 
                Requirement: "El aside que contiene el nav debe ser un botón de hamburguesa que ocupe la derecha de una barra inferior fija"
                It implies clicking it opens the nav. Let's make it a bottom sheet or side drawer.
            */}
            {isGlobalNavOpen && (
                <div className="fixed inset-0 z-[60] bg-black bg-opacity-50 flex justify-end" onClick={toggleGlobalNav}>
                    <div className="w-[80%] h-full bg-blue-950 text-blue-50 p-6 flex flex-col shadow-xl" onClick={e => e.stopPropagation()}>
                         <div className="flex flex-col gap-6 overflow-y-auto flex-1">
                            <NavItem href="/" text="Navegacion.inicio" icon={<HomeIcon className="w-8 h-8" colorClass="var(--blue-50)" />} />
                            <NavItem href="/proyecto" text="Navegacion.proyecto" icon={<ProyectoIcon className="w-8 h-8" colorClass="var(--blue-50)" />} />
                            <NavItem href="/capas" text="Navegacion.capas" icon={<CapasIcon className="w-8 h-8" colorClass="var(--blue-50)" />} />
                            <NavItem href="/ayuda" text="Navegacion.ayuda" icon={<AyudaIcon className="w-8 h-8" colorClass="var(--blue-50)" />} />
                            <NavItem href="/acercaDe" text="Navegacion.acercaDe" icon={<AcercaDeIcon className="w-8 h-8" colorClass="var(--blue-50)" />} />
                            <NavItem href="/contacto" text="Navegacion.contacto" icon={<ContactoIcon className="w-8 h-8" colorClass="var(--blue-50)" />} />
                            <NavItem href="/idioma" text="Navegacion.idioma" icon={<IdiomaIcon className="w-8 h-8" colorClass="var(--blue-50)" />} />
                            
                            <div className="mt-4">
                                <BotonSesion />
                            </div>
                         </div>
                         <div className="mt-4 flex justify-end">
                            <button onClick={toggleGlobalNav} className="text-white text-xl font-bold p-2 border border-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-white transition-colors">X</button>
                         </div>
                    </div>
                </div>
            )}
        </div>
    </div>
  );
}
