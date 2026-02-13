import { toast } from 'sonner'

import { authClient } from '@/lib/auth/auth-client'

const handleDisable2FA = async ({ password }: { password: string }) => {
  if (!password) return

  const { error } = await authClient.twoFactor.disable({
    password: password,
  })

  if (!error) {
    toast.success('২-ফ্যাক্টর অথেন্টিকেশন ডিজেবল করা হয়েছে।')
    window.location.reload()
  } else {
    toast.error('ডিজেবল করতে সমস্যা হয়েছে: ' + error.message)
  }
}
