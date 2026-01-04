"use client";

import { useIdioma } from "@/context/IdiomaContext";

export default function TranslatedFooter() {
    const { t } = useIdioma();

    return (
        <>
            {t("layout.description")}&nbsp;
            <span className="font-bold">Gustavo Francisco Eichhorn</span>
        </>
    );
}
