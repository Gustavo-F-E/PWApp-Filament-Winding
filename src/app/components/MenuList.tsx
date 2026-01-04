// src/components/MenuList.tsx
import { MenuItem, MenuItemProps } from './MenuItem';

interface MenuListProps {
  items: (MenuItemProps & { onClick?: () => void })[]; 
  mobileMode?: boolean;
}

export function MenuList({ items = [], mobileMode = false }: MenuListProps) {
  return (
    <>
      {items.map((item, index) => (
        <MenuItem
          key={index}
          columnas={item.columnas}
          href={item.href}
          Icon={item.Icon}
          text={item.text}
          isActive={item.isActive}
          iconColor={item.iconColor}
          textClass={item.textClass}
          onClick={item.onClick}
          mobileMode={mobileMode}
        />
      ))}
    </>
  );
}