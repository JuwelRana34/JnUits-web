import { Suspense } from 'react'

import { Trophy } from 'lucide-react'

import { TopMembersWraper } from './TopMembersWraper'

export async function TopMembersMainComponent() {
  return (
    <section className="bg-white py-24 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative mb-16 flex flex-col items-center text-center">
          <div className="mb-4 inline-flex items-center rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-semibold tracking-wide text-cyan-600 uppercase dark:text-cyan-400">
            <Trophy className="mx-2 mr-1 h-6 w-6" /> Top Contributors
          </div>

          {/* Main Heading with Gradient */}
          <h2 className="bg-linear-to-b from-slate-900 to-slate-700 bg-clip-text text-4xl font-black tracking-tight text-transparent sm:text-5xl dark:from-white dark:to-slate-400">
            Community Leaderboard
          </h2>

          <div className="mt-2 h-1.5 w-20 rounded-full bg-linear-to-r from-cyan-500 to-blue-600 shadow-sm shadow-cyan-500/50" />

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 dark:text-slate-400">
            Celebrating our most dedicated members who continuously contribute
            to the society&apos;s growth.{' '}
            <span className="font-semibold text-cyan-600 dark:text-cyan-400">
              Updated in real-time.
            </span>
          </p>

          <div className="pointer-events-none absolute -top-10 -z-10 h-32 w-full bg-cyan-500/10 blur-[100px]" />
        </div>
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-10">
              <p className="text-gray-500">Loading top members...</p>
            </div>
          }
        >
          <TopMembersWraper />
        </Suspense>
      </div>
    </section>
  )
}
