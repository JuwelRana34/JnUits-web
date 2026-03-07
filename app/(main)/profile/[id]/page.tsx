'use client'
import { use, useEffect, useState } from 'react'

import { verifyMember } from '@/actions/profile'

type Status = 'loading' | 'valid' | 'invalid' | 'error'

interface MemberData {
  name: string | null
  membershipId: string | null
  createdAt: Date | string
}

export default function VerifyPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)

  const [status, setStatus] = useState<Status>('loading')
  const [member, setMember] = useState<MemberData | null>(null)

  useEffect(() => {
    const MemberCheck = async () => {
      try {
        const data = await verifyMember(id)
        if (!data) {
          setStatus('invalid')
          return
        }
        setMember(data)
        setStatus('valid')
      } catch {
        setStatus('error')
      }
    }

    MemberCheck()
  }, [id])

  if (!id) return <p>Invalid QR</p>

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f0f3ff] p-4 font-sans">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="mb-1 text-xs font-bold tracking-[0.25em] text-[#0f2d82] uppercase">
            Jagannath University
          </p>
          <p className="text-xs tracking-widest text-slate-400 uppercase">
            IT Society · JnUITS
          </p>
        </div>

        <div className="overflow-hidden rounded-3xl bg-white shadow-xl shadow-blue-900/10">
          <div className="h-1.5 bg-linear-to-r from-[#0f2d82] via-[#3b5bdb] to-[#0f2d82]" />

          <div className="p-8">
            {status === 'loading' && (
              <div className="flex flex-col items-center gap-4 py-6">
                <div className="relative h-14 w-14">
                  <div className="absolute inset-0 rounded-full border-2 border-blue-100" />
                  <div className="absolute inset-0 animate-spin rounded-full border-2 border-t-[#0f2d82]" />
                </div>
                <p className="text-sm tracking-wide text-slate-400">
                  Verifying membership...
                </p>
              </div>
            )}

            {status === 'valid' && member && (
              <div className="flex flex-col items-center gap-5">
                <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-emerald-200 bg-emerald-50">
                  <svg
                    className="h-8 w-8 text-emerald-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[10px] font-bold tracking-[0.2em] text-emerald-700 uppercase">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                  Active Member
                </span>
                <div className="h-px w-full bg-slate-100" />
                <div className="w-full space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold tracking-widest text-slate-400 uppercase">
                      Name
                    </span>
                    <span className="text-sm font-bold text-slate-800">
                      {member.name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold tracking-widest text-slate-400 uppercase">
                      Member ID
                    </span>
                    <span className="text-sm font-bold text-[#0f2d82]">
                      {member.membershipId}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold tracking-widest text-slate-400 uppercase">
                      Member Since
                    </span>
                    <span className="text-sm font-semibold text-slate-600">
                      {new Date(member.createdAt).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
                <div className="h-px w-full bg-slate-100" />
                <p className="text-center text-[10px] leading-relaxed text-slate-400">
                  This membership has been verified by
                  <br />
                  <span className="font-semibold text-[#0f2d82]">
                    JnUITS · Jagannath University
                  </span>
                </p>
              </div>
            )}

            {status === 'invalid' && (
              <div className="flex flex-col items-center gap-5">
                <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-red-200 bg-red-50">
                  <svg
                    className="h-8 w-8 text-red-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-[10px] font-bold tracking-[0.2em] text-red-600 uppercase">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                  {member ? 'Membership Expired' : 'Member Not Found'}
                </span>
                <div className="h-px w-full bg-slate-100" />
                {member && (
                  <div className="w-full space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold tracking-widest text-slate-400 uppercase">
                        Name
                      </span>
                      <span className="text-sm font-bold text-slate-800">
                        {member.name}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold tracking-widest text-slate-400 uppercase">
                        Member ID
                      </span>
                      <span className="text-sm font-bold text-slate-500">
                        ID-{member.membershipId}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold tracking-widest text-slate-400 uppercase">
                        Member Since
                      </span>
                      <span className="text-sm font-semibold text-slate-600">
                        {new Date(member.createdAt).toLocaleDateString(
                          'en-GB',
                          {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          }
                        )}
                      </span>
                    </div>
                  </div>
                )}
                {!member && (
                  <p className="text-center text-xs text-slate-400">
                    No member found with ID{' '}
                    <span className="font-bold text-slate-600">#{id}</span>
                  </p>
                )}
                <div className="h-px w-full bg-slate-100" />
                <p className="text-center text-[10px] text-slate-400">
                  Contact{' '}
                  <span className="font-semibold text-[#0f2d82]">
                    jnuitsbd@gmail.com
                  </span>{' '}
                  for help
                </p>
              </div>
            )}

            {status === 'error' && (
              <div className="flex flex-col items-center gap-4 py-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-amber-200 bg-amber-50">
                  <svg
                    className="h-8 w-8 text-amber-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                    />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-slate-700">
                  Invalid QR Code
                </p>
                <p className="text-center text-xs text-slate-400">
                  Something went wrong. Please try again.
                </p>
              </div>
            )}
          </div>
          <div className="h-1 bg-linear-to-r from-transparent via-blue-100 to-transparent" />
        </div>

        <p className="mt-6 text-center text-[10px] tracking-wide text-slate-400">
          www.jnuits.org.bd
        </p>
      </div>
    </main>
  )
}
