import { GraduationCap, Trophy } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'

import AvatarUploader from './AvatarUploader'

interface ProfileHeaderProps {
  action?: React.ReactNode
  user: {
    name: string | null
    image: string | null
    role: string
    department: string
    batch: string | null
    membershipId: string | null
    points: number
    studentId: string
  }
}

export default function ProfileHeader({ user, action }: ProfileHeaderProps) {
  return (
    <Card className="overflow-hidden border-0 bg-linear-to-br from-indigo-600 via-indigo-700 to-slate-900 shadow-xl">
      <div className="relative px-6 py-8 sm:px-8 sm:py-10">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-white/5 blur-2xl" />
        <div className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-indigo-400/10 blur-xl" />

        <div className="relative flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          <AvatarUploader
            key={user.image || user.name || 'avatar'}
            initialImage={user.image}
            name={user.name}
          />

          <div className="flex-1 space-y-3 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                {user.name ?? 'Member'}
              </h1>
              <Badge className="bg-white/20 text-white backdrop-blur-sm hover:bg-white/30">
                {user.role?.replace(/_/g, ' ')}
              </Badge>
            </div>

            {(user.department || user.batch) && (
              <div className="flex flex-wrap items-center justify-center gap-2 text-indigo-100 sm:justify-start">
                <GraduationCap className="hidden h-4 w-4 sm:block" />
                <span className="text-sm font-medium">
                  {[user.department, user.batch && `Batch ${user.batch}`]
                    .filter(Boolean)
                    .join(' • ')}
                </span>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-center gap-4 sm:justify-start">
              <span className="text-xs text-indigo-200/90">
                Student ID: {user.studentId}
              </span>
              {user.membershipId && (
                <span className="text-xs text-indigo-200/90">
                  Member ID: {user.membershipId}
                </span>
              )}
            </div>
          </div>

          <div className="flex shrink-0 flex-col items-center gap-3">
            <div className="flex flex-col items-center rounded-xl bg-white/10 px-6 py-4 backdrop-blur-sm">
              <Trophy className="mb-1 h-6 w-6 text-amber-300" />
              <span className="text-3xl font-black text-white tabular-nums">
                {user.points ?? 0}
              </span>
              <span className="text-xs font-medium tracking-wider text-indigo-200 uppercase">
                Points
              </span>
            </div>
            {action}
          </div>
        </div>
      </div>
    </Card>
  )
}
