import { Metadata } from 'next'

import { CallToAction } from './_components/CallToAction'
import { FeaturesSection } from './_components/FeaturesSection'
import { HeroCarousel } from './_components/HeroCarousel'
import { TopMembersMainComponent } from './_components/TopMemberMainComponent'

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
        <TopMembersMainComponent />
        <CallToAction />
      </main>
    </div>
  )
}
