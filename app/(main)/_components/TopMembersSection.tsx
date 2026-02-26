import Image from 'next/image'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

const topMembers = [
  {
    id: 1,
    name: 'Sarah Rahman',
    role: 'Lead Developer',
    points: 1250,
    image: '/MainLogo.svg',
    badge: 'Elite Developer',
  },
  {
    id: 2,
    name: 'Fahim Ahmed',
    role: 'UI/UX Designer',
    points: 1100,
    image: '/MainLogo.svg',
    badge: 'Design Guru',
  },
  {
    id: 3,
    name: 'Jannat Ferdous',
    role: 'Event Coordinator',
    points: 980,
    image: '/MainLogo.svg',
    badge: 'Organizer',
  },
  {
    id: 4,
    name: 'Asif Karim',
    role: 'Cybersecurity Enthusiast',
    points: 850,
    image: '/MainLogo.svg',
    badge: 'Security Pro',
  },
  {
    id: 5,
    name: 'Lubna Hossen',
    role: 'Competitive Programmer',
    points: 820,
    image: '/MainLogo.svg',
    badge: 'Code Master',
  },
]

export function TopMembersSection() {
  return (
    <section className="bg-white py-24 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            Top 5 Active Members
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
            Celebrating our most dedicated members who continuously contribute
            to the society&apos;s growth and success.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {topMembers.map((member, index) => (
            <Card
              key={member.id}
              className={`group relative overflow-hidden border-slate-200 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl dark:border-slate-800 ${
                index === 0
                  ? 'border-cyan-200 bg-cyan-50/50 ring-2 ring-cyan-500/20 sm:col-span-2 lg:z-10 lg:col-span-1 lg:scale-110 dark:border-cyan-800 dark:bg-cyan-950/20'
                  : 'bg-slate-50 dark:bg-slate-900/50'
              }`}
            >
              <CardContent className="flex h-full flex-col items-center justify-center p-6 text-center">
                {/* Ranking Badge */}
                <div
                  className={`absolute top-0 right-0 flex h-12 w-12 items-center justify-center rounded-bl-2xl font-bold text-white shadow-md ${
                    index === 0
                      ? 'bg-linear-to-br from-yellow-400 to-yellow-600'
                      : index === 1
                        ? 'bg-linear-to-br from-slate-300 to-slate-500'
                        : index === 2
                          ? 'bg-linear-to-br from-amber-600 to-amber-800'
                          : 'bg-slate-800 text-sm dark:bg-slate-700'
                  }`}
                >
                  #{index + 1}
                </div>

                <div className="relative mt-4 mb-6">
                  <div
                    className={`absolute inset-0 rounded-full opacity-20 blur-md ${index === 0 ? 'bg-cyan-500' : 'bg-slate-500'}`}
                  ></div>
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={500}
                    height={500}
                    className={`relative h-24 w-24 rounded-full border-4 object-cover transition-transform group-hover:scale-110 ${
                      index === 0
                        ? 'border-cyan-500'
                        : 'border-white dark:border-slate-800'
                    }`}
                  />
                </div>

                <h3 className="w-full truncate text-lg font-bold text-slate-900 dark:text-white">
                  {member.name}
                </h3>
                <p className="mb-2 text-sm font-medium text-cyan-600 dark:text-cyan-400">
                  {member.role}
                </p>

                <Badge
                  variant="secondary"
                  className="mb-4 bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                >
                  {member.badge}
                </Badge>

                <div className="mt-auto flex w-full items-center justify-between border-t border-slate-200 pt-4 text-sm font-semibold text-slate-500 dark:border-slate-800 dark:text-slate-400">
                  <span>Points</span>
                  <span
                    className={`text-lg font-bold ${index === 0 ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-900 dark:text-white'}`}
                  >
                    {member.points.toLocaleString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
