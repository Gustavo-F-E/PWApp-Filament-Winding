"use client";

import React, { useEffect, useRef } from "react";
import { useMobile } from "@/context/MobileContext";
import { useIdioma } from "@/context/IdiomaContext";
import MenuHome from "./components/MenuHome";

interface HomeLogicProps {
    children: (props: { t: (key: string) => string }) => React.ReactNode;
}

export default function HomeLogic({ children }: HomeLogicProps) {
    const { setPageMenuContent } = useMobile();
    const { t } = useIdioma();

    const contentSet = useRef(false);

    useEffect(() => {
        if (!contentSet.current) {
            setPageMenuContent(<MenuHome mobileMode={true} />);
            contentSet.current = true;
        }
    }, [setPageMenuContent]);

    return <>{children({ t })}</>;
}
