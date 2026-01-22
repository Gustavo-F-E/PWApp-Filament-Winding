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
  mobileMode?: boolean;
  linkEnabled?: boolean; // Cambiado a boolean
}

export function MenuItem({
    columnas,
    href,
    Icon,
    text = null,
    isActive = false,
    iconColor = undefined,
    textClass = "",
    onClick,
    mobileMode = false,
    linkEnabled = true, // Valor por defecto true
}: MenuItemProps) {
    // Estado para hover
    const [isHovered, setIsHovered] = React.useState(false);

    const handleClick = (e: React.MouseEvent) => {
        if (!linkEnabled) {
            e.preventDefault();
        }

        if (onClick) {
            e.preventDefault();
            onClick();
        }
    };

    // Determinar color del icono basado en hover
    const getIconColor = () => {
        if (!linkEnabled) {
            return "var(--blue-400)"; // Color para deshabilitado
        }

        if (isHovered) {
            return "var(--blue-50)"; // Color en hover
        }

        return iconColor || "var(--blue-950)"; // Color normal
    };

    // Clases condicionales para cuando está deshabilitado
    const disabledClasses = !linkEnabled
        ? "cursor-not-allowed opacity-70 pointer-events-none"
        : "cursor-pointer hover:bg-blue-900 group";

    if (mobileMode) {
        return (
            <div className="w-full h-16 mb-2 landscape:h-full landscape:mb-0">
                {linkEnabled ? (
                    <Link
                        href={href}
                        onClick={handleClick}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        className={`
              w-full h-full flex items-center px-4 rounded-lg
              landscape:flex-col landscape:justify-center landscape:items-center landscape:px-1
              ${isActive ? "bg-blue-900 border-l-4 border-blue-50 landscape:border-l-0 landscape:border-b-4" : ""}
              ${disabledClasses}
              transition-colors duration-200
            `}
                    >
                        <div className="flex-shrink-0 mr-4 landscape:mr-0 landscape:mb-1">
                            <Icon
                                className="w-8 h-8 landscape:w-10 landscape:h-10"
                                colorClass={getIconColor()}
                            />
                        </div>
                        <div
                            className={`flex-grow text-left text-blue-50 ${textClass} landscape:text-center`}
                        >
                            <span className="font-bold landscape:text-xs">
                                {text}
                            </span>
                        </div>
                    </Link>
                ) : (
                    // Cuando está deshabilitado, renderizar un div en lugar de Link
                    <div
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        className={`w-full h-full flex items-center px-4 rounded-lg landscape:flex-col landscape:justify-center landscape:items-center landscape:px-1${disabledClasses}transition-colors duration-200`}
                    >
                        <div className="flex-shrink-0 mr-4 landscape:mr-0 landscape:mb-1">
                            <Icon
                                className="w-8 h-8 landscape:w-10 landscape:h-10"
                                colorClass={getIconColor()}
                            />
                        </div>
                        <div
                            className={`flex-grow text-left text-blue-50 ${textClass} landscape:text-center`}
                        >
                            <span className="font-bold landscape:text-xs">
                                {text}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // Para modo desktop
    return (
        <div className={`row-span-6 ${columnas} h-full`}>
            {linkEnabled ? (
                <Link
                    href={href}
                    onClick={handleClick}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    className={`
            h-full w-full
            grid grid-rows-6 grid-cols-1
            items-center
            justify-center
            text-fluid-lg
            transition-all
            duration-200
            font-light 
            
            ${isActive ? "text-blue-50 bg-blue-900 font-bold" : "bg-transparent text-blue-50"}
            ${disabledClasses}
            hover:font-bold
            hover: text-blue-50
          `}
                >
                    {/* ICONO */}
                    <div className="row-span-4 flex items-center justify-center">
                        <Icon
                            className="w-[60px] h-[60px] block mx-auto transition-colors group-hover:scale-110 duration-200"
                            colorClass={getIconColor()}
                        />
                    </div>

                    {/* TEXTO */}
                    <div
                        className={`
              row-span-2
              flex
              items-center
              justify-center
              w-full
              min-h-[40px]  
              max-h-[40px]  
              transition-transform
              duration-200
              group-hover:scale-110
              group-hover:text-blue-50
              ${textClass}
            `}
                    >
                        <span className="text-center text-fluid-sm line-clamp-2">
                            {text}
                        </span>
                    </div>
                </Link>
            ) : (
                // Cuando está deshabilitado en modo desktop
                <div
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    className={`
            h-full w-full
            grid grid-rows-6 grid-cols-1
            items-center
            justify-center
            text-fluid-lg
            transition-all
            duration-200
            font-light 
            bg-transparent text-blue-50
            ${disabledClasses}
          `}
                >
                    {/* ICONO */}
                    <div className="row-span-4 flex items-center justify-center">
                        <Icon
                            className="w-[60px] h-[60px] block mx-auto"
                            colorClass={getIconColor()}
                        />
                    </div>

                    {/* TEXTO */}
                    <div
                        className={`
              row-span-2
              flex
              items-center
              justify-center
              w-full
              min-h-[40px]  
              max-h-[40px]  
              ${textClass}
            `}
                    >
                        <span className="text-center text-fluid-sm line-clamp-2">
                            {text}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}