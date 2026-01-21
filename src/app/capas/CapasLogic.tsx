"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useMobile } from "@/context/MobileContext";
import MenuCapas from "../components/MenuCapas";

interface CapasLogicProps {
    children: (props: {
        isAsideOpen: boolean;
        isAsideVisible: boolean;
        toggleAside: () => void;
    }) => React.ReactNode;
}

export default function CapasLogic({ children }: CapasLogicProps) {
    const { setPageMenuContent, setLandscapeSidebarOpen } = useMobile();
    const [isAsideOpen, setIsAsideOpen] = useState(false);
    const [isAsideVisible, setIsAsideVisible] = useState(false);

    useEffect(() => {
        setPageMenuContent(<MenuCapas mobileMode={true} />);
        setLandscapeSidebarOpen(true);
    }, [setPageMenuContent, setLandscapeSidebarOpen]);

    const toggleAside = useCallback(() => {
        if (isAsideOpen) {
            setIsAsideOpen(false);
            setTimeout(() => {
                setIsAsideVisible(false);
            }, 300);
        } else {
            setIsAsideVisible(true);
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setIsAsideOpen(true);
                });
            });
        }
    }, [isAsideOpen]);

    return (
        <>
            {children({
                isAsideOpen,
                isAsideVisible,
                toggleAside,
            })}
        </>
    );
}
