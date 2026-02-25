import { BookOpen, Laptop, Trophy, Users } from 'lucide-react'

export function FeaturesSection() {
  const features = [
    {
      name: 'Workshops & Seminars',
      description:
        'Hands-on sessions on trending technologies to enhance your technical proficiency.',
      icon: Laptop,
      color: 'text-cyan-500',
      bg: 'bg-cyan-500/10',
    },
    {
      name: 'Project Development',
      description:
        'Collaborate on real-world projects to build practical experience and strong portfolios.',
      icon: BookOpen,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
    {
      name: 'Competitions',
      description:
        'Participate in hackathons and coding contests to ignite competitive programming skills.',
      icon: Trophy,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
    },
    {
      name: 'Networking Events',
      description:
        'Connect with industry leading professionals, successful alumni, and ambitious peers.',
      icon: Users,
      color: 'text-pink-500',
      bg: 'bg-pink-500/10',
    },
  ]

  return (
    <section className="bg-slate-50 py-24 dark:bg-slate-900/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="mb-16 text-center text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            Empowering the Next Generation
          </h2>
        </div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
            {features.map((feature) => (
              <div
                key={feature.name}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 transition-all hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/50"
              >
                <dt className="flex items-center gap-x-3 text-base leading-7 font-semibold text-gray-900 dark:text-white">
                  <div
                    className={`mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br ${feature.bg} shadow-sm transition-transform duration-300 group-hover:scale-110`}
                  >
                    <feature.icon
                      className={`h-8 w-8 ${feature.color}`}
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-slate-900 dark:text-white">
                    {feature.name}
                  </h3>
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-gray-400">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
