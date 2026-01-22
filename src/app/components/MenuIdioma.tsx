// src/components/MenuIdioma.tsx
'use client'

import { useIdioma } from '@/context/IdiomaContext';
import { InglesIcon, EspañolIcon, AlemanIcon, PortuguesIcon } from './IconosSVG';
import { MenuList } from './MenuList';

export default function MenuIdioma({ mobileMode = false }: { mobileMode?: boolean }) {
  const { idioma, setIdioma } = useIdioma();

  const menuItems = [
      {
          columnas: "col-[1/3]",
          href: "#",
          Icon: InglesIcon,
          text: "English", // "English" o "Inglés"
          isActive: idioma === "en",
          iconColor: "var(--blue-950)",
          textClass: idioma === "en" ? "text-blue-50" : "text-blue-950",
          linkEnabled: true,
          onClick: () => setIdioma("en"),
      },
      {
          columnas: "col-[3/6]",
          href: "#",
          Icon: EspañolIcon,
          text: "Español",
          isActive: idioma === "es",
          iconColor: "var(--blue-950)",
          textClass: idioma === "es" ? "text-blue-50" : "text-blue-950",
          linkEnabled: true,
          onClick: () => setIdioma("es"),
      },
      {
          columnas: "col-[6/9]",
          href: "#",
          Icon: AlemanIcon,
          text: "Deuch",
          isActive: idioma === "de",
          iconColor: "var(--blue-950)",
          textClass: idioma === "de" ? "text-blue-50" : "text-blue-950",
          linkEnabled: true,
          onClick: () => setIdioma("de"),
      },
      {
          columnas: "col-[9/12]",
          href: "#",
          Icon: PortuguesIcon,
          text: "Portugues",
          isActive: idioma === "pt",
          iconColor: "var(--blue-950)",
          textClass: idioma === "pt" ? "text-blue-50" : "text-blue-950",
          linkEnabled: true,
          onClick: () => setIdioma("pt"),
      },
  ];

  return (
    <div className={mobileMode ? "w-full flex flex-col" : "h-full w-full grid grid-rows-[repeat(6,1fr)] grid-cols-[repeat(18,1fr)]"}>
      <MenuList items={menuItems} mobileMode={mobileMode} />
    </div>
  );
}