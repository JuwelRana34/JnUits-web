import { Metadata } from 'next'
import Link from 'next/link'

import {
  BookOpen,
  BriefcaseIcon,
  GlobeIcon,
  Laptop,
  Trophy,
  Users,
  UsersIcon,
} from 'lucide-react'

import { BackgroundBeams } from '@/components/ui/background-beams'
import { RainbowButton } from '@/components/ui/rainbow-button'

export const metadata: Metadata = {
  title: 'About Us | JNUITS',
  description: 'Learn more about Jagannath University IT Society',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-cyan-500/30 dark:bg-slate-950">
      {/* Hero Section */}
      <section className="relative flex min-h-[25rem] w-full flex-col items-center justify-center overflow-hidden bg-slate-50 py-10 md:py-20 dark:bg-slate-950">
        <div className="z-10 mx-auto max-w-7xl px-4 text-center">
          <h1 className="relative z-10 bg-linear-to-b from-slate-800 to-slate-500 bg-clip-text text-center text-5xl font-extrabold tracking-tight text-transparent sm:text-5xl md:text-6xl dark:from-neutral-100 dark:to-neutral-500">
            Jagannath University <br />
            <span className="bg-linear-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
              IT Society
            </span>
          </h1>
          <p className="mx-auto my-6 max-w-2xl text-center text-lg text-slate-600 sm:text-xl md:text-2xl dark:text-neutral-400">
            Driving technological excellence through innovation, education, and
            community. We are the premier technology hub at Jagannath
            University.
          </p>
        </div>
        <BackgroundBeams className="opacity-40" />
      </section>

      {/* Mission, Vision, Values Section */}
      <section className="relative z-20 mx-auto -mt-10 max-w-7xl px-4 sm:px-6 md:-mt-15 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="flex h-full w-full flex-col items-center justify-center bg-white p-8 text-center text-slate-800 dark:bg-slate-900 dark:text-neutral-100">
            <div className="mb-6 rounded-full bg-cyan-500/10 p-4">
              <GlobeIcon className="h-10 w-10 text-cyan-500" />
            </div>
            <h3 className="mb-4 text-2xl font-bold">Our Mission</h3>
            <p className="leading-relaxed text-slate-600 dark:text-neutral-400">
              To empower students with cutting-edge IT knowledge and skills,
              fostering a community of innovators and problem solvers ready for
              the digital age.
            </p>
          </div>

          <div className="flex h-full w-full flex-col items-center justify-center bg-white p-8 text-center text-slate-800 dark:bg-slate-900 dark:text-neutral-100">
            <div className="mb-6 rounded-full bg-blue-500/10 p-4">
              <BriefcaseIcon className="h-10 w-10 text-blue-500" />
            </div>
            <h3 className="mb-4 text-2xl font-bold">Our Vision</h3>
            <p className="leading-relaxed text-slate-600 dark:text-neutral-400">
              To be the leading IT society in Bangladesh, recognized for
              excellence in technical education, research, and collaborative
              development.
            </p>
          </div>

          <div className="flex h-full w-full flex-col items-center justify-center bg-white p-8 text-center text-slate-800 dark:bg-slate-900 dark:text-neutral-100">
            <div className="mb-6 rounded-full bg-purple-500/10 p-4">
              <UsersIcon className="h-10 w-10 text-purple-500" />
            </div>
            <h3 className="mb-4 text-2xl font-bold">Our Values</h3>
            <p className="leading-relaxed text-slate-600 dark:text-neutral-400">
              Innovation, Collaboration, and Integrity are at the core of
              everything we do. We believe in growing together by sharing
              knowledge.
            </p>
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl md:text-5xl dark:text-white">
            What We Do
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600 dark:text-neutral-400">
            Discover the various activities and initiatives we undertake to
            foster a thriving tech culture.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 transition-all hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/50">
            <div className="absolute inset-0 bg-linear-to-br from-cyan-500/5 to-blue-500/5 opacity-0 transition-opacity group-hover:opacity-100"></div>
            <Laptop className="mb-6 h-10 w-10 text-cyan-500 transition-transform group-hover:scale-110" />
            <h3 className="mb-3 text-xl font-bold text-slate-900 dark:text-white">
              Workshops
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Regularly organize hands-on sessions on trending technologies to
              enhance members&apos; technical proficiency.
            </p>
          </div>

          <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 transition-all hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/50">
            <div className="absolute inset-0 bg-linear-to-br from-blue-500/5 to-purple-500/5 opacity-0 transition-opacity group-hover:opacity-100"></div>
            <BookOpen className="mb-6 h-10 w-10 text-blue-500 transition-transform group-hover:scale-110" />
            <h3 className="mb-3 text-xl font-bold text-slate-900 dark:text-white">
              Project Dev
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Facilitate real-world collaborative projects to build practical
              experience and strong portfolios.
            </p>
          </div>

          <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 transition-all hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/50">
            <div className="absolute inset-0 bg-linear-to-br from-purple-500/5 to-pink-500/5 opacity-0 transition-opacity group-hover:opacity-100"></div>
            <Trophy className="mb-6 h-10 w-10 text-purple-500 transition-transform group-hover:scale-110" />
            <h3 className="mb-3 text-xl font-bold text-slate-900 dark:text-white">
              Competitions
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Host hackathons and coding contests to ignite competitive
              programming and identify top talents.
            </p>
          </div>

          <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 transition-all hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/50">
            <div className="absolute inset-0 bg-linear-to-br from-pink-500/5 to-orange-500/5 opacity-0 transition-opacity group-hover:opacity-100"></div>
            <Users className="mb-6 h-10 w-10 text-pink-500 transition-transform group-hover:scale-110" />
            <h3 className="mb-3 text-xl font-bold text-slate-900 dark:text-white">
              Networking
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Connect members with industry leading professionals, successful
              alumni, and ambitious peers.
            </p>
          </div>
        </div>
      </section>

      {/* Join Us Section */}
      <section className="bg-slate-100 py-24 dark:bg-slate-900/20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="mb-6 text-4xl font-extrabold text-slate-900 dark:text-white">
            Ready to shape the future?
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
            Become a part of our growing community and start your journey in the
            world of technology today. Unlock exclusive resources, mentorship,
            and endless opportunities.
          </p>
          <RainbowButton className="px-8 py-6 text-lg font-semibold" asChild>
            <Link href="/registration">Join Our Community Today</Link>
          </RainbowButton>
        </div>
      </section>
    </div>
  )
}
