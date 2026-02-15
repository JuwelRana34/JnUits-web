import { Metadata } from 'next'

import { BriefcaseIcon, GlobeIcon, UsersIcon } from 'lucide-react'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { LampContainer } from '@/components/ui/lamp'
import { Separator } from '@/components/ui/separator'

export const metadata: Metadata = {
  title: 'About Us | JNUITS',
  description: 'Learn more about Jagannath University IT Society',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <LampContainer>
        <h1 className="mt-3 bg-linear-to-br from-slate-300 to-slate-500 bg-clip-text py-4 text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl">
          Jagannath University <br /> IT Society
        </h1>
      </LampContainer>

      <div className="relative z-10 container mx-auto -mt-20 px-4 pb-20">
        {/* Short Intro */}
        <section className="mb-16 text-center">
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-slate-400">
            JNUITS is a dynamic platform for tech enthusiasts at Jagannath
            University, fostering innovation, learning, and community in the IT
            sector.
          </p>
        </section>

        {/* Mission, Vision, Values Cards */}
        <section className="mb-20 grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card className="border-slate-800 bg-slate-900/50 text-white transition-colors hover:bg-slate-900">
            <CardHeader className="text-center">
              <GlobeIcon className="mx-auto mb-2 h-10 w-10 text-cyan-400" />
              <CardTitle>Our Mission</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-slate-400">
              <CardDescription className="text-slate-400">
                To empower students with cutting-edge IT knowledge and skills,
                fostering a community of innovators.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-900/50 text-white transition-colors hover:bg-slate-900">
            <CardHeader className="text-center">
              <BriefcaseIcon className="mx-auto mb-2 h-10 w-10 text-cyan-400" />
              <CardTitle>Our Vision</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-slate-400">
              <CardDescription className="text-slate-400">
                To be the leading IT society in Bangladesh, recognized for
                excellence in technical education.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-900/50 text-white transition-colors hover:bg-slate-900">
            <CardHeader className="text-center">
              <UsersIcon className="mx-auto mb-2 h-10 w-10 text-cyan-400" />
              <CardTitle>Our Values</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-slate-400">
              <CardDescription className="text-slate-400">
                Innovation, Collaboration, and Integrity are at the core of
                everything we do.
              </CardDescription>
            </CardContent>
          </Card>
        </section>

        <Separator className="mb-20 bg-slate-800" />

        {/* What We Do Section */}
        <section className="mx-auto max-w-5xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-white md:text-5xl">
            What We Do
          </h2>
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-800/50 bg-slate-900/30 p-6">
              <h3 className="mb-3 text-xl font-semibold text-cyan-300">
                Workshops & Seminars
              </h3>
              <p className="text-slate-400">
                Regularly organize sessions on trending technologies to enhance
                members&apos; technical skills.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-800/50 bg-slate-900/30 p-6">
              <h3 className="mb-3 text-xl font-semibold text-cyan-300">
                Project Development
              </h3>
              <p className="text-slate-400">
                Facilitate real-world projects, fostering practical experience
                and problem-solving abilities.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-800/50 bg-slate-900/30 p-6">
              <h3 className="mb-3 text-xl font-semibold text-cyan-300">
                Competitions
              </h3>
              <p className="text-slate-400">
                Host hackathons and coding contests to promote competitive
                programming and identify talent.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-800/50 bg-slate-900/30 p-6">
              <h3 className="mb-3 text-xl font-semibold text-cyan-300">
                Networking
              </h3>
              <p className="text-slate-400">
                Connect members with industry professionals, alumni, and peers
                for strong career growth.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
