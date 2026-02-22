import Image from 'next/image'

import { User } from 'lucide-react'

export const getRoleIcon = (role: string) => {
  const icons: Record<string, string> = {
    SUPER_ADMIN: 'https://cdn-icons-png.flaticon.com/128/1959/1959460.png',
    ADMIN: 'https://cdn-icons-png.flaticon.com/128/2058/2058913.png',
    EXECUTIVE: 'https://cdn-icons-png.flaticon.com/128/408/408373.png',
    SUB_EXECUTIVE: 'https://cdn-icons-png.flaticon.com/128/3375/3375293.png',
    MEMBER: 'https://cdn-icons-png.flaticon.com/128/18371/18371637.png',
  }

  const url = icons[role]

  if (url) {
    return (
      <Image
        src={url.trim()}
        alt={role}
        width={20}
        height={20}
        className="h-7 w-7 object-contain"
      />
    )
  }

  return <User className="h-7 w-7 text-white/70" />
}
