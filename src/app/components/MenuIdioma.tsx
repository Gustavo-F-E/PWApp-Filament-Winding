'use client'

import { usePathname } from 'next/navigation'
import { InglesIcon, EspañolIcon, AlemanIcon, PortuguesIcon} from './IconosSVG'
import { useAuth } from '@/context/AuthContext'
import { MenuList } from './MenuList'

export default function MenuIniciarSesion() {
  const pathname = usePathname()
  const isActive = pathname === '/sesion'
  const { isLogged } = useAuth()
  const menuItems = [
  {
    columnas: 'col-[1/3]',
    href: '/ingles',
    Icon: InglesIcon,
    text: 'English',
    isActive,
    iconColor: isLogged ? 'var(--blue-400)' : 'var(--blue-950)',
    textClass: isLogged ? 'text-blue-950' : 'text-blue-950',
  },
  {
    columnas: 'col-[3/6]',
    href: '/español',
    Icon: EspañolIcon,
    text: 'Español',
    isActive,
    iconColor: isLogged ? 'var(--blue-400)' : 'var(--blue-950)',
    textClass: isLogged ? 'text-blue-950' : 'text-blue-950',
  },
  {
    columnas: 'col-[6/9]',
    href: '/aleman',
    Icon: AlemanIcon,
    text: 'Deuch',
    isActive,
    iconColor: isLogged ? 'var(--blue-400)' : 'var(--blue-950)',
    textClass: isLogged ? 'text-blue-950' : 'text-blue-950',
  },
  {
    columnas: 'col-[9/12]',
    href: '/portugues',
    Icon: PortuguesIcon,
    text: 'Portugues',
    isActive,
    iconColor: isLogged ? 'var(--blue-400)' : 'var(--blue-950)',
    textClass: isLogged ? 'text-blue-950' : 'text-blue-950',
  },
];

  return (
    <div className="h-full w-full grid grid-rows-[repeat(6,1fr)] grid-cols-[repeat(18,1fr)]">
      <MenuList items={menuItems} />
    </div>
  )
}
