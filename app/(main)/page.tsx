import { Metadata } from 'next'

import { CallToAction } from './_components/CallToAction'
import { FeaturesSection } from './_components/FeaturesSection'
import { HeroCarousel } from './_components/HeroCarousel'
import { TopMembersSection } from './_components/TopMembersSection'

export const metadata: Metadata = {
  title: 'Home | JNUITS',
  description:
    'Jagannath University IT Society - Empowering the next generation of tech leaders.',
}

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <HeroCarousel />
        <FeaturesSection />
        <TopMembersSection />
        <CallToAction />
      </main>
    </div>
  )
}
