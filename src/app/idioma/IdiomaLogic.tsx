"use client";

import React, { useEffect } from "react";
import { useMobile } from "@/context/MobileContext";
import { useIdioma } from "@/context/IdiomaContext";
import MenuIdioma from "../components/MenuIdioma";

interface IdiomaLogicProps {
    children: (props: { t: (key: string) => string }) => React.ReactNode;
}

export default function IdiomaLogic({ children }: IdiomaLogicProps) {
    const { setPageMenuContent } = useMobile();
    const { t } = useIdioma();

    useEffect(() => {
        setPageMenuContent(<MenuIdioma mobileMode={true} />);
    }, [setPageMenuContent]);

    return <>{children({ t })}</>;
}
