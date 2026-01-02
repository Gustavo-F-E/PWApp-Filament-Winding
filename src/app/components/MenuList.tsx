// src/components/MenuList.tsx
import { MenuItem, MenuItemProps } from './MenuItem';

interface MenuListProps {
  items: (MenuItemProps & { onClick?: () => void })[]; // ← AÑADIR onClick aquí
}

export function MenuList({ items = [] }: MenuListProps) {
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
          onClick={item.onClick} // ← Pasar onClick
        />
      ))}
    </>
  );
}