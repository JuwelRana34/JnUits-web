import { CalendarDays, CheckCircle2, Clock } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { getCachedSession } from '@/lib/auth/getSession'

import { getCachedRegistrations } from './get-registrations'

export default async function RegistrationList() {
  const session = await getCachedSession()

  if (!session?.user) return null

  const data = await getCachedRegistrations(session.user.id)

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-200 bg-zinc-50/50 py-16 dark:border-zinc-800 dark:bg-zinc-900/20">
        <CalendarDays className="mb-3 h-12 w-12 text-zinc-300 dark:text-zinc-600" />
        <p className="text-sm font-medium text-zinc-500">No applications yet</p>
        <p className="mt-1 text-xs text-zinc-400">
          Your event registrations will appear here
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-3">
      {data.map((reg) => (
        <div
          key={reg.id}
          className="group bg-card flex items-center justify-between gap-4 rounded-xl border p-4 shadow-sm transition-all hover:border-indigo-500/30 hover:shadow-md dark:bg-zinc-950/50"
        >
          <div className="min-w-0 flex-1 space-y-1">
            <p className="truncate font-semibold text-zinc-900 dark:text-zinc-100">
              {reg.event?.title ?? reg.type.replace(/_/g, ' ')}
            </p>
            <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
              Applied{' '}
              {new Date(reg.appliedAt).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}
            </span>
          </div>

          <div className="shrink-0">
            {reg.status === 'APPROVED' ? (
              <Badge className="gap-1.5 rounded-full border-0 bg-emerald-500/15 px-3 py-1 font-semibold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400">
                <CheckCircle2 size={14} /> Approved
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="gap-1.5 rounded-full border-amber-200 font-semibold text-amber-700 dark:border-amber-800 dark:text-amber-500"
              >
                <Clock size={14} /> {reg.status}
              </Badge>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
