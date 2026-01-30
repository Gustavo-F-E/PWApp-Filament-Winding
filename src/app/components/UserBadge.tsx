// src\app\components\UserBadge.tsx

'use client'

import Image from 'next/image'
import { UserIcon } from './IconosSVG';
import { useIdioma } from '@/context/IdiomaContext';
import { useAuth } from '@/context/AuthContext';

export default function UserBadge({ mobileMode = false }: { mobileMode?: boolean }) {
  const { user } = useAuth();
  const { t } = useIdioma();

  const displayName = user?.name || user?.username || t('UserBadge.user');
  const avatarUrl = (user as any)?.avatar; // Keeping flexibility for future avatar support

  if (mobileMode) {
    return (
      <div className="relative w-full h-full flex flex-col items-center justify-center">
        <div className="relative w-12 h-12 flex flex-col items-center justify-center">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt="Avatar usuario"
              fill
              className="rounded-full object-contain"
            />
          ) : (
            <UserIcon className="w-[70%] h-[70%]" colorClass="var(--blue-50)" />
          )}
        </div>
        {/* TEXTO */}
        <div className="flex items-center justify-center">
          <span className="font-bold text-center text-blue-50 text-fluid-sm">
            {displayName}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-rows-6 grid-cols-4 h-full w-full text-blue-50">

      {/* ICONO */}
      <div className="row-[1/5] col-[1/-1] relative h-full flex items-center justify-center align-middle">
        <div className="relative h-full w-full p-2">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt="Avatar usuario"
              fill
              className="rounded-full object-contain"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <UserIcon className="w-16 h-16" colorClass="var(--blue-950)" />
            </div>
          )}
        </div>
      </div>

      {/* TEXTO */}
      <div className="row-[5/7] col-[1/-1] flex items-center justify-center">
        <span className="font-bold text-center text-blue-950">
          {displayName}
        </span>
      </div>

    </div>
  )
}
