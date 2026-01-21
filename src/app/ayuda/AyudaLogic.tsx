"use client";

import React, { useEffect } from "react";
import { useMobile } from "@/context/MobileContext";
import MenuAyuda from "../components/MenuAyuda";

interface AyudaLogicProps {
    children: () => React.ReactNode;
}

export default function AyudaLogic({ children }: AyudaLogicProps) {
    const { setPageMenuContent } = useMobile();

    useEffect(() => {
        setPageMenuContent(<MenuAyuda mobileMode={true} />);
    }, [setPageMenuContent]);

    return <>{children()}</>;
}
