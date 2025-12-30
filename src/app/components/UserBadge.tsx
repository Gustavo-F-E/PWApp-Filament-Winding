'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { UserIcon } from './IconosSVG';

type User = {
  name: string
  avatar?: string
}

export default function UserBadge() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  return (
    <div className="grid grid-rows-6 grid-cols-4 h-full w-full text-blue-50">

        {/* ICONO */}
        <div className="row-[1/5] col-[1/-1] relative h-full flex items-center justify-center align-middle">
          <div className="relative h-full w-full p-2">
              {user?.avatar ? (
              <Image
                  src={user.avatar}
                  alt="Avatar usuario"
                  fill
                  className="rounded-full object-contain"
              />
              ) : (
              <div className="w-full h-full flex items-center justify-center">
            <UserIcon className="w-16 h-16" colorClass="#E8F1FF" />
          </div>
              )}
          </div>
        </div>

      {/* TEXTO */}
      <div className="row-[5/7] col-[1/-1] flex items-center justify-center">
        <span className="font-bold text-center text-blue-950">
          {user ? user.name : 'Usuario'}
        </span>
      </div>

    </div>
  )
}
