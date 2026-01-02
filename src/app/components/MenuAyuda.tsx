'use client'

import { usePathname } from 'next/navigation'
import { FAQIcon, ForumIcon, VideotutorialesIcon} from './IconosSVG'
import { useAuth } from '@/context/AuthContext'
import { MenuList } from './MenuList'

export default function MenuIniciarSesion() {
  const pathname = usePathname()
  const isActive = pathname === '/sesion'
  const { isLogged } = useAuth()
  const menuItems = [
  {
    columnas: 'col-[3/6]',
    href: '/FAQs',
    Icon: FAQIcon,
    text: 'FAQs',
    isActive,
    iconColor: isLogged ? 'var(--blue-400)' : 'var(--blue-950)',
    textClass: isLogged ? 'text-blue-400' : 'text-blue-950',
  },
  {
    columnas: 'col-[6/9]',
    href: '/foroDeUsuarios',
    Icon: ForumIcon,
    text: 'Foro de Usuarios',
    isActive,
    iconColor: isLogged ? 'var(--blue-950)' : 'var(--blue-400)',
    textClass: isLogged ? 'text-blue-950' : 'text-blue-400',
  },
    {
    columnas: 'col-[1/3]',
    href: '/videoTutoriales',
    Icon: VideotutorialesIcon,
    text: 'Videotutoriales',
    isActive,
    iconColor: isLogged ? 'var(--blue-400)' : 'var(--blue-950)',
    textClass: isLogged ? 'text-blue-400' : 'text-blue-950',
  },
];

  return (
    <div className="h-full w-full grid grid-rows-[repeat(6,1fr)] grid-cols-[repeat(18,1fr)]">
      <MenuList items={menuItems} />
    </div>
  )
}
