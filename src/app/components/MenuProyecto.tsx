'use client'

import { usePathname } from 'next/navigation'
import { NuevoProyectoIcon, LinerIcon, MaquinaIcon, GCodeIcon} from './IconosSVG'
import { useAuth } from '@/context/AuthContext'
import { MenuList } from './MenuList'

export default function MenuIniciarSesion() {
  const pathname = usePathname()
  const isActive = pathname === '/sesion'
  const { isLogged } = useAuth()
  const menuItems = [
  {
    columnas: 'col-[1/3]',
    href: '/nuevoProyecto',
    Icon: NuevoProyectoIcon,
    text: 'Crear Proyecto',
    isActive,
    iconColor: isLogged ? 'var(--blue-950)' : 'var(--blue-400)',
    textClass: isLogged ? 'text-blue-950' : 'text-blue-400',
  },
  {
    columnas: 'col-[3/6]',
    href: '/liner',
    Icon: LinerIcon,
    text: 'Liner',
    isActive,
    iconColor: isLogged ? 'var(--blue-950)' : 'var(--blue-400)',
    textClass: isLogged ? 'text-blue-950' : 'text-blue-400',
  },
    {
    columnas: 'col-[6/9]',
    href: '/maquina',
    Icon: MaquinaIcon,
    text: 'Maquina',
    isActive,
    iconColor: isLogged ? 'var(--blue-950)' : 'var(--blue-400)',
    textClass: isLogged ? 'text-blue-950' : 'text-blue-400',
  },
    {
    columnas: 'col-[9/12]',
    href: '/GCode',
    Icon: GCodeIcon,
    text: 'Código G',
    isActive,
    iconColor: isLogged ? 'var(--blue-950)' : 'var(--blue-400)',
    textClass: isLogged ? 'text-blue-950' : 'text-blue-400',
  },
];

  return (
    <div className="h-full w-full grid grid-rows-[repeat(6,1fr)] grid-cols-[repeat(18,1fr)]">
      <MenuList items={menuItems} />
    </div>
  )
}
