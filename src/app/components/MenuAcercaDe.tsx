'use client'

import { usePathname } from 'next/navigation'
import { ContactoIcon } from './IconosSVG'
import { useAuth } from '@/context/AuthContext'
import { MenuList } from './MenuList'
//import { useIdioma } from '@/context/IdiomaContext';

export default function MenuAcercaDe({ mobileMode = false }: { mobileMode?: boolean }) {
    const pathname = usePathname();
    const isActive = pathname === "/sesion";
    const { isLogged } = useAuth();
    //const { t } = useIdioma();
    const menuItems = [
        {
            columnas: "col-[1/3]",
            href: "acercaDe/contacto",
            Icon: ContactoIcon,
            text: "Contacto",
            isActive,
            iconColor: isLogged ? "var(--blue-950)" : "var(--blue-950)",
            textClass: isLogged
                ? "text-blue-950 hover:text-blue-50"
                : "text-blue-950 hover:text-blue-50",
            linkEnabled: true,
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
