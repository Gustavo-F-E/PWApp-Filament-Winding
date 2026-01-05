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
  onClick?: () => void;
  mobileMode?: boolean; // ← AÑADIR
}

export function MenuItem({
  columnas,
  href,
  Icon,
  text = null,
  isActive = false,
  iconColor = undefined,
  textClass = '',
  onClick,
  mobileMode = false
}: MenuItemProps) {
  
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };

  if (mobileMode) {
     return (
        <div className="w-full h-16 mb-2 landscape:h-full landscape:mb-0">
            <Link
                href={href}
                onClick={handleClick}
                className={`
                    w-full h-full flex items-center px-4 rounded-lg
                    landscape:flex-col landscape:justify-center landscape:items-center landscape:px-1
                    ${isActive ? 'bg-blue-900 border-l-4 border-blue-50 landscape:border-l-0 landscape:border-b-4' : 'hover:bg-blue-900'}
                    transition-colors duration-200
                `}
            >
                <div className="flex-shrink-0 mr-4 landscape:mr-0 landscape:mb-1">
                    <Icon className="w-8 h-8 landscape:w-10 landscape:h-10" colorClass={iconColor || 'var(--blue-50)'} />
                </div>
                <div className={`flex-grow text-left text-blue-50 ${textClass} landscape:text-center`}>
                    <span className="font-bold landscape:text-xs">{text}</span>
                </div>
            </Link>
        </div>
     );
  }

  return (
    <div className={`row-span-6 ${columnas} h-full`}>
      <Link
        href={href}
        onClick={handleClick}
        className={`
          h-full w-full
          grid grid-rows-[4fr_2fr]
          items-center
          text-fluid-lg
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
          <span className="text-center text-fluid-sm line-clamp-2">{text}</span>
        </div>
      </Link>
    </div>
  );
}