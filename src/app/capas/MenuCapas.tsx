"use client";

import { usePathname } from "next/navigation";
import {
    NuevaCapaIcon,
    ElegirPatronIcon,
    MaterialIcon,
    GraficosIcon,
} from "../components/IconosSVG";
import { useAuth } from "@/context/AuthContext";
import { MenuList } from "../components/MenuList";
import { useIdioma } from "@/context/IdiomaContext";

export default function MenuCapas({
    mobileMode = false,
}: {
    mobileMode?: boolean;
}) {
    const pathname = usePathname();
    const isActive = pathname === "/sesion";
    const { isLogged } = useAuth();
    const { t } = useIdioma();
    const menuItems = [
        {
            columnas: "col-[1/3]",
            href: "capas/nuevaCapa",
            Icon: NuevaCapaIcon,
            text: t("MenuCapas.nuevaCapa"),
            isActive,
            iconColor: isLogged ? "var(--blue-950)" : "var(--blue-400)",
            textClass: isLogged ? "text-blue-950" : "text-blue-400",
            linkEnabled: isLogged,
        },
        {
            columnas: "col-[3/6]",
            href: "capas/material",
            Icon: MaterialIcon,
            text: t("MenuCapas.material"),
            isActive,
            iconColor: isLogged ? "var(--blue-950)" : "var(--blue-400)",
            textClass: isLogged ? "text-blue-950" : "text-blue-400",
            linkEnabled: isLogged,
        },
        {
            columnas: "col-[6/9]",
            href: "capas/seleccionarPatron",
            Icon: ElegirPatronIcon,
            text: t("MenuCapas.seleccionarPatron"),
            isActive,
            iconColor: isLogged ? "var(--blue-950)" : "var(--blue-400)",
            textClass: isLogged ? "text-blue-950" : "text-blue-400",
            linkEnabled: isLogged,
        },
        {
            columnas: "col-[9/12]",
            href: "capas/graficos",
            Icon: GraficosIcon,
            text: t("MenuCapas.graficos"),
            isActive,
            iconColor: isLogged ? "var(--blue-950)" : "var(--blue-400)",
            textClass: isLogged ? "text-blue-950" : "text-blue-400",
            linkEnabled: isLogged,
        },
    ];

    return (
        <div
            className={
                mobileMode
                    ? "w-full flex flex-col"
                    : "h-full w-full grid grid-rows-[repeat(6,1fr)] grid-cols-[repeat(18,1fr)]"
            }
        >
            <MenuList items={menuItems} mobileMode={mobileMode} />
        </div>
    );
}
