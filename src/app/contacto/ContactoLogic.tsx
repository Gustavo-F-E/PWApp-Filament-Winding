"use client";

import React, { useEffect } from "react";
import { useMobile } from "@/context/MobileContext";
import MenuVacio from "../components/MenuVacio";

interface ContactoLogicProps {
    children: () => React.ReactNode;
}

export default function ContactoLogic({ children }: ContactoLogicProps) {
    const { setPageMenuContent } = useMobile();

    useEffect(() => {
        setPageMenuContent(<MenuVacio />);
    }, [setPageMenuContent]);

    return <>{children()}</>;
}
