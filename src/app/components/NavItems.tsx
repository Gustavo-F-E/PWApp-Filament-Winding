'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
//import Image from 'next/image'
import { ReactElement } from 'react'

type NavItemProps = {
  href: string
  text: string
  icon: ReactElement
}

export default function NavItem({ href, text, icon }: NavItemProps) {
  const pathname = usePathname()

  const isActive = pathname === href

  return (
    <Link
      href={href}
      className={`
        row-span-2
        grid grid-cols-6
        items-center
        border-y
        ${isActive ? 'border-blue-50 text-blue-50 bg-blue-900 font-bold' : 'border-transparent'}
        hover:border-blue-50
        transition-all 
        duration-200
        group
      `}
    >
      {/* ICONO */}
      <span className="col-start-1 col-end-3 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
        {icon}
      </span>

      {/* TEXTO */}
      <span className="col-start-3 col-end-7 text-sm  transition-all duration-200 group-hover:text-lg group-hover:scale-y-110"
        style={{ transformOrigin: 'left center' }}>
        {text}
      </span>
    </Link>
  )
}
