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
}

export function MenuItem({
  columnas,
  href,
  Icon,
  text = null,
  isActive = false,
  iconColor = undefined,
  textClass = '',
}: MenuItemProps) {
  return (
    <div className={`row-[1/7] ${columnas} flex items-center justify-center text-lg`}>
      <Link
        href={href}
        className={`
          h-full
            w-full
            grid grid-rows-6
            items-center
            text-lg
            transition-all
            duration-200
            font-light 
            hover:scale-110 
            hover:font-bold
          ${isActive ? 'text-blue-50 bg-blue-900 font-bold' : 'bg-transparent'}
        `}
      >
        {/* ICONO */}
        <div className="row-[1/5] flex items-center justify-center">
          <Icon
            className="w-[60px] h-[60px] translate-y-2 block mx-auto transition-colors duration-200"
            colorClass={iconColor}
          />
        </div>

        {/* TEXTO */}
        <div
          className={`
            row-[5/7]
            flex
            items-center
            justify-center
            transition-transform
            duration-200
            hover:scale-110
            ${textClass}
          `}
        >
          {text}
        </div>
      </Link>
    </div>
  );
}
