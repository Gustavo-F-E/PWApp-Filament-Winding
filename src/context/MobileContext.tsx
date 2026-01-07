'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo, useEffect, useRef } from 'react';

interface MobileContextType {
    setPageMenuContent: (content: ReactNode) => void;
    pageMenuContent: ReactNode;
    isPageMenuOpen: boolean;
    togglePageMenu: () => void;
    closePageMenu: () => void;
    isLandscapeSidebarOpen: boolean;
    setLandscapeSidebarOpen: (isOpen: boolean) => void;
    orientation: 'portrait' | 'landscape';
    isMobile: boolean;
    screenWidth: number;
    screenHeight: number;
    isPwaStandalone: boolean;
}

const MobileContext = createContext<MobileContextType | undefined>(undefined);

// Extender la interfaz Window para TypeScript
declare global {
    interface Window {
        MSStream?: any;
        opera?: any;
    }
}

export function MobileProvider({ children }: { children: ReactNode }) {
    const [pageMenuContent, setPageMenuContent] = useState<ReactNode>(null);
    const [isPageMenuOpen, setIsPageMenuOpen] = useState(false);
    
    // Default open for most pages in landscape
    const [isLandscapeSidebarOpen, setLandscapeSidebarOpen] = useState(true);
    
    // Nuevos estados para orientación
    const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
    const [isMobile, setIsMobile] = useState(false);
    const [screenWidth, setScreenWidth] = useState(0);
    const [screenHeight, setScreenHeight] = useState(0);
    const [isPwaStandalone, setIsPwaStandalone] = useState(false);
    
    // Ref para el timer de resize (para evitar el error de asignación)
    const resizeTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Función para verificar si está en modo PWA standalone
    const checkPwaMode = useCallback(() => {
        if (typeof window === 'undefined') return false;
        
        // Método 1: Usando matchMedia (estándar)
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                           window.matchMedia('(display-mode: fullscreen)').matches ||
                           window.matchMedia('(display-mode: minimal-ui)').matches;
        
        // Método 2: Para iOS específicamente
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        const isIOSStandalone = isIOS && (window.navigator as any).standalone === true;
        
        // Método 3: Verificar si se está ejecutando desde la pantalla de inicio
        const isInWebApp = window.matchMedia('(display-mode: browser)').matches === false;
        
        const result = isStandalone || isIOSStandalone || isInWebApp;
        setIsPwaStandalone(result);
        
        console.log('Modo PWA:', result ? 'standalone' : 'browser');
        return result;
    }, []);

    // Función para detectar orientación y actualizar estados
    const detectOrientationAndScreen = useCallback(() => {
        if (typeof window === 'undefined') return;
        
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        setScreenWidth(width);
        setScreenHeight(height);
        
        // Para PWA standalone en iOS, necesitamos métodos especiales
        const isStandalone = checkPwaMode();
        
        // Método 1: Usar matchMedia (más confiable para PWA)
        const mediaQuery = window.matchMedia("(orientation: landscape)");
        const isLandscapeFromMedia = mediaQuery.matches;
        
        // Método 2: Usar ratio width/height
        const isLandscapeFromRatio = width > height;
        
        // Método 3: Usar window.orientation si está disponible (iOS)
        let isLandscapeFromOrientation = false;
        if ((window as any).orientation !== undefined) {
            // window.orientation devuelve: 0 (portrait), 90 (landscape derecha), -90 (landscape izquierda)
            const orientationValue = Number((window as any).orientation);
            isLandscapeFromOrientation = Math.abs(orientationValue) === 90;
        }
        
        // Decidir cuál método usar
        let isLandscape;
        if (isStandalone && ((window as any).orientation) !== undefined) {
            // Para PWA standalone en iOS, usar window.orientation
            isLandscape = isLandscapeFromOrientation;
            console.log('Usando window.orientation para PWA iOS');
        } else if (mediaQuery.media !== 'not all' && mediaQuery.matches !== undefined) {
            // Para navegadores normales, usar matchMedia
            isLandscape = isLandscapeFromMedia;
            console.log('Usando matchMedia');
        } else {
            // Fallback al ratio
            isLandscape = isLandscapeFromRatio;
            console.log('Usando ratio width/height');
        }
        
        const newOrientation = isLandscape ? 'landscape' : 'portrait';
        setOrientation(newOrientation);
        
        // Auto-abrir/cerrar sidebar basado en orientación
        if (isMobile) {
            setLandscapeSidebarOpen(isLandscape);
        }
        
        // Debug log (puedes comentarlo en producción)
        console.log(`Orientación: ${newOrientation}, Ancho: ${width}, Alto: ${height}, Móvil: ${isMobile}, PWA: ${isStandalone ? 'standalone' : 'browser'}`);
        
        // Actualizar atributo en html para CSS
        document.documentElement.setAttribute('data-orientation', newOrientation);
        document.documentElement.setAttribute('data-pwa-mode', isStandalone ? 'standalone' : 'browser');
        
        return { isLandscape, newOrientation, width, height };
    }, [isMobile, checkPwaMode]);

    // Detectar si es dispositivo móvil
    useEffect(() => {
        const checkIfMobile = () => {
            // Verificar user agent
            const userAgent = navigator.userAgent || navigator.vendor || window.opera;
            const isMobileDevice = /iPhone|iPad|iPod|Android|webOS|BlackBerry|Windows Phone/i.test(userAgent);
            
            // También verificar tamaño de pantalla
            const isSmallScreen = window.innerWidth <= 768;
            
            setIsMobile(isMobileDevice || isSmallScreen);
            
            // Re-detectamos orientación después de saber si es móvil
            detectOrientationAndScreen();
        };

        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);
        
        return () => {
            window.removeEventListener('resize', checkIfMobile);
        };
    }, [detectOrientationAndScreen]);

    // Configurar listeners de orientación - CRUCIAL PARA PWA
    useEffect(() => {
        if (typeof window === 'undefined') return;

        // Detectar orientación inicial
        const initialDetection = detectOrientationAndScreen();
        
        // Forzar una segunda detección después de un delay (para iOS PWA)
        if (initialDetection && initialDetection.newOrientation === 'portrait') {
            setTimeout(() => {
                detectOrientationAndScreen();
            }, 300);
        }

        // 1. Escuchar evento orientationchange (nativo, funciona en PWA)
        const handleOrientationChange = () => {
            console.log('Evento orientationchange disparado');
            // Delay más largo para iOS PWA
            setTimeout(detectOrientationAndScreen, 150);
        };

        // 2. Escuchar resize como fallback (con debounce)
        const handleResize = () => {
            // Limpiar timer anterior
            if (resizeTimerRef.current) {
                clearTimeout(resizeTimerRef.current);
            }
            
            // Configurar nuevo timer con delay más largo para PWA
            resizeTimerRef.current = setTimeout(() => {
                detectOrientationAndScreen();
            }, 250);
        };

        // 3. Escuchar evento de cambio de pantalla (para PWA fullscreen)
        const handleVisibilityChange = () => {
            if (!document.hidden) {
                console.log('App vuelve a ser visible');
                // Delay para asegurar que iOS haya actualizado las dimensiones
                setTimeout(detectOrientationAndScreen, 200);
            }
        };

        // 4. Escuchar evento personalizado del OrientationHandler
        const handlePwaOrientationChange = (event: Event) => {
            const customEvent = event as CustomEvent;
            if (customEvent.detail && customEvent.detail.isLandscape !== undefined) {
                console.log('Evento personalizado pwa-orientation-change recibido');
                const { isLandscape } = customEvent.detail;
                const newOrientation = isLandscape ? 'landscape' : 'portrait';
                setOrientation(newOrientation);
                
                if (isMobile) {
                    setLandscapeSidebarOpen(isLandscape);
                }
                
                document.documentElement.setAttribute('data-orientation', newOrientation);
            }
        };

        // 5. Escuchar evento pageshow (importante para iOS)
        const handlePageShow = (event: PageTransitionEvent) => {
            if (event.persisted) {
                console.log('Page restored from bfcache');
                setTimeout(detectOrientationAndScreen, 100);
            }
        };

        // Agregar todos los listeners
        window.addEventListener('orientationchange', handleOrientationChange);
        window.addEventListener('resize', handleResize);
        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('pwa-orientation-change', handlePwaOrientationChange as EventListener);
        window.addEventListener('pageshow', handlePageShow);
        
        // Para dispositivos con acelerómetro (opcional)
        if ('ondeviceorientation' in window) {
            window.addEventListener('deviceorientation', handleOrientationChange);
        }

        // Para iOS específicamente, agregar listener para gestureend
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        if (isIOS) {
            window.addEventListener('gestureend', handleOrientationChange);
        }

        // Limpiar listeners
        return () => {
            window.removeEventListener('orientationchange', handleOrientationChange);
            window.removeEventListener('resize', handleResize);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('pwa-orientation-change', handlePwaOrientationChange as EventListener);
            window.removeEventListener('pageshow', handlePageShow);
            
            // Limpiar timer
            if (resizeTimerRef.current) {
                clearTimeout(resizeTimerRef.current);
            }
            
            if ('ondeviceorientation' in window) {
                window.removeEventListener('deviceorientation', handleOrientationChange);
            }
            
            if (isIOS) {
                window.removeEventListener('gestureend', handleOrientationChange);
            }
        };
    }, [detectOrientationAndScreen, isMobile]);

    // Efecto especial para iOS PWA - detectar cambios después de interacciones
    useEffect(() => {
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        
        if (isIOS && isPwaStandalone) {
            console.log('Configurando listeners especiales para iOS PWA');
            
            // Detectar después de cualquier interacción del usuario
            const handleUserInteraction = () => {
                setTimeout(detectOrientationAndScreen, 50);
            };
            
            // Agregar listeners para interacciones comunes
            window.addEventListener('touchstart', handleUserInteraction);
            window.addEventListener('touchend', handleUserInteraction);
            window.addEventListener('click', handleUserInteraction);
            
            return () => {
                window.removeEventListener('touchstart', handleUserInteraction);
                window.removeEventListener('touchend', handleUserInteraction);
                window.removeEventListener('click', handleUserInteraction);
            };
        }
    }, [isPwaStandalone, detectOrientationAndScreen]);

    const togglePageMenu = useCallback(() => setIsPageMenuOpen(prev => !prev), []);
    const closePageMenu = useCallback(() => setIsPageMenuOpen(false), []);

    // Wrapper to ensure that when we set content, we also have it available
    const setContent = useCallback((content: ReactNode) => {
        setPageMenuContent(content);
    }, []);

    const contextValue = useMemo(() => ({
        setPageMenuContent: setContent,
        pageMenuContent,
        isPageMenuOpen,
        togglePageMenu,
        closePageMenu,
        isLandscapeSidebarOpen,
        setLandscapeSidebarOpen,
        orientation,
        isMobile,
        screenWidth,
        screenHeight,
        isPwaStandalone
    }), [
        setContent, 
        pageMenuContent, 
        isPageMenuOpen, 
        togglePageMenu, 
        closePageMenu, 
        isLandscapeSidebarOpen, 
        setLandscapeSidebarOpen,
        orientation,
        isMobile,
        screenWidth,
        screenHeight,
        isPwaStandalone
    ]);

    return (
        <MobileContext.Provider value={contextValue}>
            {children}
        </MobileContext.Provider>
    );
}

export function useMobile() {
    const context = useContext(MobileContext);
    if (context === undefined) {
        throw new Error('useMobile must be used within a MobileProvider');
    }
    return context;
}