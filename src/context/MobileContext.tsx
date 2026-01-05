'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo } from 'react';

// ... imports

interface MobileContextType {
    setPageMenuContent: (content: ReactNode) => void;
    pageMenuContent: ReactNode;
    isPageMenuOpen: boolean;
    togglePageMenu: () => void;
    closePageMenu: () => void;
    // New state for Landscape Right Sidebar
    isLandscapeSidebarOpen: boolean;
    setLandscapeSidebarOpen: (isOpen: boolean) => void;
}

const MobileContext = createContext<MobileContextType | undefined>(undefined);

export function MobileProvider({ children }: { children: ReactNode }) {
    const [pageMenuContent, setPageMenuContent] = useState<ReactNode>(null);
    const [isPageMenuOpen, setIsPageMenuOpen] = useState(false);
    
    // Default open for most pages in landscape
    const [isLandscapeSidebarOpen, setLandscapeSidebarOpen] = useState(true);

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
        setLandscapeSidebarOpen
    }), [setContent, pageMenuContent, isPageMenuOpen, togglePageMenu, closePageMenu, isLandscapeSidebarOpen, setLandscapeSidebarOpen]);

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
