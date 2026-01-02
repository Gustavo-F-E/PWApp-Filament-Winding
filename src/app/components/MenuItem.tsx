// src/components/MenuItem.tsx
'use client'

import React from 'react';
import Link from 'next/link';

export interface IconProps {
  className?: string;
  colorClass?: string;
}

export interface MenuItemProps {
  columnas: string;
  href: string;
  Icon: React.ComponentType<IconProps> | React.ElementType;
  text?: React.ReactNode;
  isActive?: boolean;
  iconColor?: string;
  textClass?: string;
  onClick?: () => void; // ← AÑADIR esta prop
}

export function MenuItem({
  columnas,
  href,
  Icon,
  text = null,
  isActive = false,
  iconColor = undefined,
  textClass = '',
  onClick
}: MenuItemProps) {
  
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div className={`row-span-6 ${columnas} h-full`}>
      <Link
        href={href}
        onClick={handleClick}
        className={`
          h-full w-full
          grid grid-rows-[4fr_2fr]  // 4 partes para icono, 2 para texto
          items-center
          text-lg
          transition-all
          duration-200
          font-light 
          hover:font-bold
          group
          ${isActive ? 'text-blue-50 bg-blue-900 font-bold' : 'bg-transparent text-blue-50'}
        `}
      >
        {/* ICONO */}
        <div className="row-span-1 flex items-center justify-center">
          <Icon
            className="w-[60px] h-[60px] block mx-auto transition-colors group-hover:scale-110 duration-200"
            colorClass={iconColor}
          />
        </div>

        {/* TEXTO */}
        <div
          className={`
            row-span-1
            flex
            items-center
            justify-center
            w-full
            min-h-[40px]  
            max-h-[40px]  
            transition-transform
            duration-200
            group-hover:scale-110
            ${textClass}
          `}
        >
          <span className="text-center text-sm line-clamp-2">{text}</span>
        </div>
      </Link>
    </div>
  );
}