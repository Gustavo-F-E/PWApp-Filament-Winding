'use client'

import { usePathname } from 'next/navigation'
import { AbrirSesionIcon, CerrarSesionIcon, RegistrarseIcon} from './IconosSVG'
import { useAuth } from '@/context/AuthContext'
import { MenuList } from './MenuList'

export default function MenuIniciarSesion() {
  const pathname = usePathname()
  const isActive = pathname === '/sesion'
  const { isLogged } = useAuth()
  const menuItems = [
  {
    columnas: 'col-[1/3]',
    href: '/iniciarSesion',
    Icon: AbrirSesionIcon,
    text: 'Iniciar sesión',
    isActive,
    iconColor: isLogged ? 'var(--blue-400)' : 'var(--blue-950)',
    textClass: isLogged ? 'text-blue-400' : 'text-blue-950',
  },
  {
    columnas: 'col-[3/6]',
    href: '/registrarse',
    Icon: RegistrarseIcon,
    text: 'Registrarse',
    isActive,
    iconColor: isLogged ? 'var(--blue-400)' : 'var(--blue-950)',
    textClass: isLogged ? 'text-blue-400' : 'text-blue-950',
  },
  {
    columnas: 'col-[6/9]',
    href: '/CerrarSesion',
    Icon: CerrarSesionIcon,
    text: 'Cerrar Sesión',
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
