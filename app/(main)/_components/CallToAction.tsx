'use client'

import Link from 'next/link'

import { useAuth } from '@/components/features/AuthProvider'
import { RainbowButton } from '@/components/ui/rainbow-button'

export function CallToAction() {
  const { user } = useAuth()
  if (user) return null
  return (
    <div className="relative overflow-hidden bg-slate-900 py-24 sm:py-32">
      {/* Decorative background elements */}
      <div
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        aria-hidden="true"
      >
        <div
          className="relative left-[calc(50%-11rem)] aspect-1155/678 w-144.5 -translate-x-1/2 rotate-30 bg-linear-to-tr from-[#06b6d4] to-[#6366f1] opacity-20 sm:left-[calc(50%-30rem)] sm:w-288.75"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        ></div>
      </div>

      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
            Ready to shape the future?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-slate-300">
            Join the Jagannath University IT Society today. Unlock exclusive
            resources, mentorship, and endless opportunities to grow your tech
            career.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <RainbowButton
              className="px-8 py-6 text-lg font-semibold shadow-lg shadow-cyan-500/30"
              asChild
            >
              <Link href="/registration">Become a Member</Link>
            </RainbowButton>
            <Link
              href="/about"
              className="text-sm leading-6 font-semibold text-white transition-colors hover:text-cyan-400"
            >
              Learn more <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
