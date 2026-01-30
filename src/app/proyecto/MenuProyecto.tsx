'use client'

import { usePathname } from 'next/navigation'
import { NuevoProyectoIcon, LinerIcon, MaquinaIcon, GCodeIcon } from '../components/IconosSVG'
import { useAuth } from '@/context/AuthContext'
import { MenuList } from '../components/MenuList'
import { useIdioma } from '@/context/IdiomaContext';

export default function MenuProyecto({ mobileMode = false }: { mobileMode?: boolean }) {
  const pathname = usePathname()
  const { isLogged } = useAuth()
  const { t } = useIdioma();
  const menuItems = [
    {
      columnas: "col-[1/3]",
      href: isLogged ? "/proyecto/crearProyecto" : "/proyecto/",
      Icon: NuevoProyectoIcon,
      text: t("MenuProyecto.CrearProyecto"),
      isActive: pathname === "/proyecto/crearProyecto",
      iconColor: isLogged ? "var(--blue-950)" : "var(--blue-400)",
      textClass: isLogged ? "text-blue-950" : "text-blue-400",
      linkEnabled: isLogged,
    },
    {
      columnas: "col-[3/6]",
      href: isLogged ? "/proyecto/liner" : "/proyecto/",
      Icon: LinerIcon,
      text: t("MenuProyecto.Liner"),
      isActive: pathname === "/proyecto/liner",
      iconColor: isLogged ? "var(--blue-950)" : "var(--blue-400)",
      textClass: isLogged ? "text-blue-950" : "text-blue-400",
      linkEnabled: isLogged,
    },
    {
      columnas: "col-[6/9]",
      href: isLogged ? "/proyecto/maquina" : "/proyecto/",
      Icon: MaquinaIcon,
      text: t("MenuProyecto.Maquina"),
      isActive: pathname === "/proyecto/maquina",
      iconColor: isLogged ? "var(--blue-950)" : "var(--blue-400)",
      textClass: isLogged ? "text-blue-950" : "text-blue-400",
      linkEnabled: isLogged,
    },
    {
      columnas: "col-[9/12]",
      href: isLogged ? "/proyecto/GCode" : "/proyecto/",
      Icon: GCodeIcon,
      text: t("MenuProyecto.CodigoG"),
      isActive: pathname === "/proyecto/GCode",
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
