'use client'

import { usePathname } from 'next/navigation'
import { FAQIcon, ForumIcon, VideotutorialesIcon} from './IconosSVG'
import { useAuth } from '@/context/AuthContext'
import { MenuList } from './MenuList'
import { useIdioma } from "@/context/IdiomaContext";

export default function MenuAyuda({ mobileMode = false }: { mobileMode?: boolean }) {
  const pathname = usePathname()
  const isActive = pathname === '/sesion'
  const { isLogged } = useAuth()
  const { t } = useIdioma();
  const menuItems = [
      {
          columnas: "col-[1/3]",
          href: "/videoTutoriales",
          Icon: VideotutorialesIcon,
          text: t("MenuAyuda.videoTutoriales"),
          isActive,
          iconColor: isLogged ? "var(--blue-950)" : "var(--blue-950)",
          textClass: isLogged ? "text-blue-950" : "text-blue-950",
          linkEnabled: true,
      },
      {
          columnas: "col-[3/6]",
          href: "/FAQs",
          Icon: FAQIcon,
          text: "FAQs",
          isActive,
          iconColor: isLogged ? "var(--blue-950)" : "var(--blue-950)",
          textClass: isLogged ? "text-blue-950" : "text-blue-950",
          linkEnabled: true,
      },
      {
          columnas: "col-[6/9]",
          href: "/foroDeUsuarios",
          Icon: ForumIcon,
          text: t("MenuAyuda.foroDeUsuarios"),
          isActive,
          iconColor: isLogged ? "var(--blue-950)" : "var(--blue-400)",
          textClass: isLogged ? "text-blue-950" : "text-blue-400",
          linkEnabled: isLogged,
      },
  ];

  return (
    <div className={mobileMode ? "w-full flex flex-col" : "h-full w-full grid grid-rows-[repeat(6,1fr)] grid-cols-[repeat(18,1fr)]"}>
      <MenuList items={menuItems} mobileMode={mobileMode} />
    </div>
  )
}
