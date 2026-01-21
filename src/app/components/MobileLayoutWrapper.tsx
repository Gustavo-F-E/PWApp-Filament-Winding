'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { HomeIcon, FillWindPathIcon, MenuIcon } from './IconosSVG';
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
  const pathname = usePathname();
  const { togglePageMenu, isPageMenuOpen, pageMenuContent, closePageMenu, isLandscapeSidebarOpen } = useMobile();

  // Cerrar menús al cambiar de ruta
  React.useEffect(() => {
    closeGlobalNav();
    closePageMenu();
  }, [pathname]);
  const [isGlobalNavOpen, setIsGlobalNavOpen] = useState(false);
  const [shouldRenderGlobalNav, setShouldRenderGlobalNav] = useState(false);
  const [isAnimatingIn, setIsAnimatingIn] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  const openGlobalNav = () => {
    if (!isGlobalNavOpen && !isAnimatingIn && !isAnimatingOut) {
      setShouldRenderGlobalNav(true);
      // Pequeño delay para forzar un re-render antes de la animación
      setTimeout(() => {
        setIsAnimatingIn(true);
        setTimeout(() => {
          setIsGlobalNavOpen(true);
          setIsAnimatingIn(false);
        }, 10);
      }, 10);
    }
  };

  const closeGlobalNav = () => {
    if (isGlobalNavOpen && !isAnimatingIn && !isAnimatingOut) {
      setIsGlobalNavOpen(false);
      setIsAnimatingOut(true);
      setTimeout(() => {
        setIsAnimatingOut(false);
        setShouldRenderGlobalNav(false);
      }, 300); // Duración de la animación
    }
  };

  const toggleGlobalNav = () => {
    if (isGlobalNavOpen || isAnimatingIn) {
      closeGlobalNav();
    } else {
      openGlobalNav();
    }
  };

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

        {/* --- MOBILE PORTRAIT LAYOUT (Hidden on large screens and landscape) --- */}
        <div className="lg:hidden landscape:hidden fixed inset-0 flex flex-col bg-blue-50">
            
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

            {/* PAGE MENU MODAL (Right Sidebar - Hamburger Menu) */}
            {(isPageMenuOpen || pageMenuContent) && (
                <div 
                    className={`
                        fixed inset-0 z-40 bg-black flex justify-end lg:hidden
                        transition-all duration-300 ease-in-out
                        ${isPageMenuOpen ? 'bg-opacity-50' : 'bg-opacity-0 pointer-events-none'}
                    `}
                    onClick={closePageMenu}
                    style={{ paddingBottom: '10%' }}
                >
                    <div 
                        className={`
                            w-[80%] h-full bg-blue-300 p-4 text-blue-950 overflow-y-auto shadow-2xl
                            transform transition-transform duration-300 ease-in-out
                            ${isPageMenuOpen ? 'translate-x-0' : 'translate-x-full'}
                        `}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {pageMenuContent}
                    </div>
                </div>
            )}

            {/* FIXED BOTTOM BAR (10% height) */}
            <nav className="h-[10%] bg-blue-950 flex items-center justify-between px-6 shrink-0 z-50">
                {/* Left: Global Nav (Home Icon) */}
                <button onClick={toggleGlobalNav} className="p-2 text-white">
                    <HomeIcon className="w-8 h-8" colorClass="var(--white-50)" />
                </button>

                {/* CENTER: User Badge (Icon Only) */}
                <div className="flex-1 px-4 flex justify-center h-full py-2">
                    <UserBadge mobileMode={true} />
                </div>

                {/* RIGHT: Page Menu Hamburger (3 lines) */}
                 <button onClick={togglePageMenu} className="p-2 text-white bg-transparent z-[60]">
                    {isPageMenuOpen ? (
                        <span className="text-xl font-bold">X</span>
                    ) : (
                        <MenuIcon className="w-8 h-8" strokeWidth={2.5} />
                    )}
                 </button>
            </nav>

            {/* GLOBAL NAV DRAWER (Left Side - Home Menu) */}
            {shouldRenderGlobalNav && (
                <>
                    <div 
                        className={`
                            fixed inset-0 z-[60] bg-black 
                            transition-all duration-300 ease-in-out
                            ${(isGlobalNavOpen || isAnimatingIn) ? 'bg-opacity-50' : 'bg-opacity-0 pointer-events-none'}
                        `}
                        onClick={closeGlobalNav}
                    ></div>
                    <div 
                        className={`
                            fixed top-0 left-0 w-[80%] h-full bg-blue-950 text-blue-50 p-6 flex flex-col shadow-xl lg:hidden z-[70]
                            transform transition-transform duration-300 ease-in-out
                            ${(isGlobalNavOpen || isAnimatingIn) ? 'translate-x-0' : '-translate-x-full'}
                        `}
                        onClick={e => e.stopPropagation()}
                    >
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
                         <div className="mt-4 flex justify-start">
                            <button 
                                onClick={closeGlobalNav} 
                                className="text-white text-xl font-bold p-2 border border-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-white transition-colors duration-200"
                            >
                                X
                            </button>
                         </div>
                    </div>
                </>
            )}
        </div>

        {/* --- MOBILE LANDSCAPE LAYOUT (Hidden on portrait and large screens) --- */}
        <div className="hidden lg:!hidden landscape:flex fixed inset-0 bg-blue-50 w-screen h-screen overflow-hidden">
            {/* LEFT SIDEBAR (20vw) */}
            <aside className="w-[20vw] h-full bg-blue-950 flex flex-col text-white fixed left-0 top-0 z-50">
                {/* Top: Logo + H1 */}
                <div className="flex flex-col items-center justify-center p-4">
                    <FillWindPathIcon className="w-16 h-16 mb-2" colorClass="var(--white-950)" />
                    <h1 className="text-center font-bold text-fluid-sm leading-tight">
                        Filament Path Generator
                    </h1>
                </div>
                
                {/* Center: UserBadge */}
                <div className="flex-1 flex items-center justify-center">
                     <UserBadge mobileMode={true} />
                </div>

                {/* Bottom: Home Icon (Toggle Nav) */}
                <div className="p-4 flex justify-center">
                    <button onClick={toggleGlobalNav} className="p-2 hover:bg-blue-900 rounded-lg transition-colors duration-200">
                        <HomeIcon className="w-10 h-10" colorClass="var(--white-50)" />
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT (Center) */}
            <main 
                className={`
                    flex-1 h-full overflow-y-auto ml-[20vw]
                    ${isLandscapeSidebarOpen ? 'mr-[20vw]' : 'mr-0'}
                    transition-all duration-300 ease-in-out
                `}
            >
                {children}
                
                <footer className="bg-red-100 text-red-950 text-center py-4 mt-auto">
                    <div className="flex items-center justify-center">
                        <TranslatedFooter />
                    </div>
                </footer>
            </main>

            {/* RIGHT SIDEBAR (20vw) - Hamburger Menu en Landscape */}
            <aside 
                className={`
                    w-[20vw] h-full bg-blue-300 border-l border-blue-200 fixed right-0 top-0 z-40 overflow-y-auto
                    transform transition-transform duration-300 ease-in-out
                    ${isLandscapeSidebarOpen ? 'translate-x-0' : 'translate-x-full'}
                `}
            >
                <div className="p-4 h-full">
                    {pageMenuContent}
                </div>
            </aside>

            {/* GLOBAL NAV DRAWER (Mobile Landscape) - Home Menu en Landscape */}
            {shouldRenderGlobalNav && (
                <>
                    <div 
                        className={`
                            fixed inset-0 z-[60] bg-black 
                            transition-all duration-300 ease-in-out
                            ${(isGlobalNavOpen || isAnimatingIn) ? 'bg-opacity-50' : 'bg-opacity-0 pointer-events-none'}
                        `}
                        onClick={closeGlobalNav}
                    ></div>
                    <div 
                        className={`
                            fixed top-0 left-0 w-[40vw] h-full bg-blue-950 text-blue-50 p-6 flex flex-col shadow-xl z-[70]
                            transform transition-transform duration-300 ease-in-out
                            ${(isGlobalNavOpen || isAnimatingIn) ? 'translate-x-0' : '-translate-x-full'}
                        `}
                        onClick={e => e.stopPropagation()}
                    >
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
                         <div className="mt-4 flex justify-start">
                            <button 
                                onClick={closeGlobalNav} 
                                className="text-white text-xl font-bold p-2 border border-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-white transition-colors duration-200"
                            >
                                X
                            </button>
                         </div>
                    </div>
                </>
            )}
        </div>
    </div>
  );
}