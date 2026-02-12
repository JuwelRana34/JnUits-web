import { redirect } from 'next/navigation'

import { getCachedSession } from '@/lib/auth/getSession'

import { getCachedProfile } from './get-profile'
import ProfileDetails from './profile-details'
import ProfileEditDialog from './profile-edit-dialog'
import ProfileHeader from './profile-header'

export default async function ProfileContent() {
  const session = await getCachedSession()

  if (!session?.user) {
    redirect('/login')
  }

  const user = await getCachedProfile(session.user.id)

  if (!user) {
    return (
      <div className="border-destructive/50 bg-destructive/10 rounded-xl border p-6 text-center">
        <p className="text-destructive font-medium">Profile not found</p>
        <p className="text-muted-foreground mt-1 text-sm">
          We couldn&apos;t load your profile. Please try again.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <ProfileHeader
        action={
          <ProfileEditDialog
            user={{
              name: user.name,
              email: user.email,
              phoneNumber: user.phoneNumber,
              showPhone: user.showPhone,
              showEmail: user.showEmail,
            }}
          />
        }
        user={{
          name: user.name,
          image: user.image,
          role: user.role,
          department: user.department,
          batch: user.batch,
          membershipId: user.membershipId,
          points: user.points,
          studentId: user.studentId,
        }}
      />
      <ProfileDetails
        user={{
          email: user.email,
          emailVerified: user.emailVerified,
          phoneNumber: user.phoneNumber,
          showPhone: user.showPhone,
          showEmail: user.showEmail,
          department: user.department,
          batch: user.batch,
          gender: user.gender,
          studentId: user.studentId,
          membershipId: user.membershipId,
          points: user.points,
          twoFactorEnabled: user.twoFactorEnabled,
          createdAt: user.createdAt,
        }}
      />
    </div>
  )
}
