'use client'

import Enable2FA from '@/components/auth/Enable2FA'
import LogoutButton from '@/components/auth/LogoutButton'

export default function SettingsPage() {
  return (
    <div>
      <LogoutButton />
      <Enable2FA />
    </div>
  )
}
