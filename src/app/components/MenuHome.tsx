'use client'

import { usePathname } from 'next/navigation'
import { TourDeInicioIcon } from './IconosSVG'
import { useAuth } from '@/context/AuthContext'
import { MenuList } from './MenuList'
import { useIdioma } from '@/context/IdiomaContext';

export default function MenuHome({ mobileMode = false }: { mobileMode?: boolean }) {
  const pathname = usePathname()
  const isActive = pathname === '/sesion'
  const { isLogged } = useAuth()
  const { t } = useIdioma();
  const menuItems = [
  {
    columnas: 'col-[1/3]',
    href: '/tourDeInicio',
    Icon: TourDeInicioIcon,
    text: t('MenuHome.tourDeInicio'),
    isActive,
    iconColor: isLogged ? 'var(--blue-950)' : 'var(--blue-950)',
    textClass: isLogged ? 'text-blue-950' : 'text-blue-950',
  },
];

  return (
    <div className={mobileMode ? "w-full flex flex-col" : "h-full w-full grid grid-rows-[repeat(6,1fr)] grid-cols-[repeat(18,1fr)]"}>
      <MenuList items={menuItems} mobileMode={mobileMode} />
    </div>
  )
}
