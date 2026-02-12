import {
  Award,
  Calendar,
  GraduationCap,
  Mail,
  Phone,
  ShieldCheck,
  User,
} from 'lucide-react'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import ProfileSecurityControls from './profile-security-controls'

interface ProfileDetailsProps {
  user: {
    email: string | null
    emailVerified: boolean
    phoneNumber: string
    showPhone: boolean
    showEmail: boolean
    department: string
    batch: string | null
    gender: string | null
    studentId: string
    membershipId: string | null
    points: number
    twoFactorEnabled: boolean
    createdAt: Date
  }
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType
  label: string
  value: string | null | undefined
}) {
  if (!value) return null
  return (
    <div className="flex items-start gap-3 py-2">
      <Icon className="text-muted-foreground mt-0.5 h-4 w-4 shrink-0" />
      <div>
        <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
          {label}
        </p>
        <p className="font-medium text-zinc-900 dark:text-zinc-100">{value}</p>
      </div>
    </div>
  )
}

export default function ProfileDetails({ user }: ProfileDetailsProps) {
  const memberSince = new Date(user.createdAt).toLocaleDateString('en-GB', {
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {/* Academic Info */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <GraduationCap className="h-5 w-5 text-indigo-500" />
            Academic
          </CardTitle>
          <CardDescription>
            Your academic info (only you see this)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-0">
          <InfoRow icon={User} label="Student ID" value={user.studentId} />
          <InfoRow
            icon={GraduationCap}
            label="Department"
            value={user.department}
          />
          <InfoRow icon={Calendar} label="Batch" value={user.batch} />
          <InfoRow icon={User} label="Gender" value={user.gender} />
        </CardContent>
      </Card>

      {/* Contact Info */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Mail className="h-5 w-5 text-indigo-500" />
            Contact
          </CardTitle>
          <CardDescription>
            Only you see this. Control what others see in Edit Profile.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-0">
          {user.showEmail && (
            <InfoRow icon={Mail} label="Email" value={user.email} />
          )}
          {user.showPhone && (
            <InfoRow icon={Phone} label="Phone" value={user.phoneNumber} />
          )}
          {!user.showEmail && !user.showPhone && (
            <p className="text-muted-foreground py-4 text-sm">
              Contact details are hidden in profile settings
            </p>
          )}
        </CardContent>
      </Card>

      {/* Membership & Security */}
      <Card className="sm:col-span-2">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-0 p-6">
            <div className="mb-4 flex items-center gap-2">
              <Award className="h-5 w-5 text-indigo-500" />
              <h3 className="font-semibold">Membership</h3>
            </div>
            <InfoRow
              icon={Award}
              label="Member ID"
              value={user.membershipId ?? 'Pending'}
            />
            <div className="flex items-start gap-3 py-2">
              <Award className="text-muted-foreground mt-0.5 h-4 w-4 shrink-0" />
              <div>
                <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                  Member Since
                </p>
                <p className="font-medium text-zinc-900 dark:text-zinc-100">
                  {memberSince}
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-0 border-t p-6 sm:border-t-0 sm:border-l">
            <div className="mb-4 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-indigo-500" />
              <h3 className="font-semibold">Security & Privacy</h3>
            </div>
            <p className="text-muted-foreground mb-4 text-xs">
              Only you see your profile. Manage verification and 2FA below.
            </p>
            <ProfileSecurityControls
              emailVerified={user.emailVerified}
              twoFactorEnabled={user.twoFactorEnabled}
            />
          </div>
        </div>
      </Card>
    </div>
  )
}
