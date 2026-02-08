'use client'
import { useState } from 'react'

import { useRouter } from 'next/navigation'

import { authClient } from '@/lib/auth/auth-client'

// সঠিক ইম্পোর্ট

interface TwoFactorEnableResponse {
  backupCodes: string[]
  totpURI: string
  twoFactorEnabled: boolean
}

export default function Enable2FA() {
  const router = useRouter() // হুক কল করা
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [isPending, setIsPending] = useState(false)
  const [loading, setLoading] = useState(false)
  const [backupCodes, setBackupCodes] = useState<string[]>([])

  const handleRequestEnable = async () => {
    if (!password) return alert('দয়া করে আগে পাসওয়ার্ড দিন।')
    setLoading(true)
    const { error } = await authClient.twoFactor.sendOtp()
    setLoading(false)

    if (!error) {
      alert('আপনার ইমেইলে ওটিপি পাঠানো হয়েছে!')
      setIsPending(true)
    } else {
      alert('Error: ' + error.message)
    }
  }

  const handleVerifyAndEnable = async () => {
    if (!otp) return alert('দয়া করে ওটিপি কোডটি দিন।')
    setLoading(true)

    // ১. ওটিপি ভেরিফাই
    const { error: otpError } = await authClient.twoFactor.verifyOtp({
      code: otp,
    })
    if (otpError) {
      setLoading(false)
      return alert('ভেরিফিকেশন ব্যর্থ: ' + otpError.message)
    }

    // ২. ২-ফ্যাক্টর এনাবল
    const { data, error: enableError } = await authClient.twoFactor.enable({
      password,
    })
    setLoading(false)

    if (!enableError) {
      const result = data as unknown as TwoFactorEnableResponse
      if (result.backupCodes) {
        setBackupCodes(result.backupCodes)
        alert(
          '২-ফ্যাক্টর অথেন্টিকেশন সফলভাবে চালু হয়েছে! ব্যাকআপ কোডগুলো সেভ করুন।'
        )
      }
    } else {
      alert('এনাবল করতে সমস্যা হয়েছে: ' + enableError.message)
    }
  }

  return (
    <div className="max-w-md rounded-xl border bg-white p-6 shadow-md dark:bg-zinc-900">
      <h3 className="mb-4 text-center text-xl font-bold text-indigo-600">
        Enable 2FA Security
      </h3>

      {/* যদি ব্যাকআপ কোড জেনারেট হয়ে যায় তবে তা দেখাবে */}
      {backupCodes.length > 0 ? (
        <div className="space-y-4">
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3 text-xs text-yellow-700">
            ⚠️ <strong>সাবধান:</strong> এই ব্যাকআপ কোডগুলো নিরাপদ কোথাও কপি করে
            রাখুন। ইমেইল এক্সেস হারালে এগুলোই আপনার একাউন্ট পুনরুদ্ধারের একমাত্র
            উপায়।
          </div>
          <div className="grid grid-cols-2 gap-2 rounded-lg bg-zinc-100 p-3 font-mono text-sm">
            {backupCodes.map((code) => (
              <div
                key={code}
                className="rounded border bg-white p-1 text-center"
              >
                {code}
              </div>
            ))}
          </div>
          <button
            onClick={() => window.location.reload()}
            className="w-full rounded-lg bg-indigo-600 py-2 font-bold text-white"
          >
            I&apos;ve Saved These Codes
          </button>
        </div>
      ) : /* বাকি ফর্ম (পাসওয়ার্ড এবং ওটিপি ইনপুট) */
      !isPending ? (
        <div className="space-y-4">
          <p className="text-sm text-zinc-500">
            নিরাপত্তা নিশ্চিত করতে পাসওয়ার্ড দিন।
          </p>
          <input
            type="password"
            placeholder="Current Password"
            className="block w-full rounded-lg border border-zinc-300 p-2.5 outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-zinc-800"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            onClick={handleRequestEnable}
            disabled={loading}
            className="w-full rounded-lg bg-indigo-600 py-2.5 font-semibold text-white hover:bg-indigo-700 disabled:bg-indigo-400"
          >
            {loading ? 'Sending OTP...' : 'Get Security Code'}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-green-600">
            ইমেইল চেক করুন, ওটিপি পাঠানো হয়েছে।
          </p>
          <input
            type="text"
            placeholder="Enter 6-digit OTP"
            className="block w-full rounded-lg border border-zinc-300 p-2.5 outline-none focus:ring-2 focus:ring-green-500 dark:bg-zinc-800"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button
            onClick={handleVerifyAndEnable}
            disabled={loading}
            className="w-full rounded-lg bg-green-600 py-2.5 font-semibold text-white hover:bg-green-700 disabled:bg-green-400"
          >
            {loading ? 'Verifying...' : 'Verify & Enable 2FA'}
          </button>
          <button
            onClick={() => setIsPending(false)}
            className="w-full text-center text-sm text-zinc-500 hover:underline"
          >
            Cancel & Back
          </button>
        </div>
      )}
    </div>
  )
}

// ggDgD-WmVUG
// xsJIt-YGX14
// lESbf-Hvs9g
// mG33F-wgAvT
// pUCqZ-fLWyW
// AkVTT-ZL6YA
// 9TV89-zVngA
// yyCIY-dsdtW
// IySVK-yYttS
// WaWsy-QgVTr
