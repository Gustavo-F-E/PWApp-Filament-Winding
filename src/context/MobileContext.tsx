'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo } from 'react';

interface MobileContextType {
    setPageMenuContent: (content: ReactNode) => void;
    pageMenuContent: ReactNode;
    isPageMenuOpen: boolean;
    togglePageMenu: () => void;
    closePageMenu: () => void;
}

const MobileContext = createContext<MobileContextType | undefined>(undefined);

export function MobileProvider({ children }: { children: ReactNode }) {
    const [pageMenuContent, setPageMenuContent] = useState<ReactNode>(null);
    const [isPageMenuOpen, setIsPageMenuOpen] = useState(false);

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
        closePageMenu
    }), [setContent, pageMenuContent, isPageMenuOpen, togglePageMenu, closePageMenu]);

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
