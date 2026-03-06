'use server'

import { cacheLife, cacheTag, revalidateTag, updateTag } from 'next/cache'

import { prisma } from '@/lib/prismadb'

export async function createCommitteeAction(formData: FormData) {
  const sessionRaw = formData.get('session') as string
  const isCurrent = formData.has('isCurrent')

  if (!sessionRaw) {
    throw new Error('Session is required')
  }

  const session = sessionRaw.trim()

  // ---- FORMAT VALIDATION ----
  // Expecting 2026-2027 format
  const regex = /^\d{4}-\d{4}$/

  if (!regex.test(session)) {
    throw new Error('Invalid format. Use 2026-2027')
  }

  const [start, end] = session.split('-').map(Number)

  if (end !== start + 1) {
    throw new Error('Session must be consecutive years')
  }

  // ---- TRANSACTION ----
  await prisma.$transaction(async (tx) => {
    const existing = await tx.committee.findUnique({
      where: { session },
    })

    if (existing) {
      throw new Error('This session already exists')
    }

    // If setting as current → unset previous current
    if (isCurrent) {
      await tx.committee.updateMany({
        data: { isCurrent: false },
      })
    }

    await tx.committee.create({
      data: {
        session,
        isCurrent,
      },
    })
  })

  revalidateTag('committees', 'max')
  updateTag('All-committees')
}

// for admin post
// export async function getCommittees() {
//   'use cache'
//   cacheTag('committees')

//   try {
//     const committees = await prisma.committee.findMany({
//       orderBy: {
//         createdAt: 'desc',
//       },
//     })

//     return committees
//   } catch (error) {
//     console.error('Failed to fetch committees:', error)
//     throw new Error('Unable to fetch committees')
//   }
// }

export async function deleteCommitteeSession(id: string) {
  await prisma.committee.delete({ where: { id } })
  updateTag('All-committees')
  updateTag('committee_members')
}

export async function searchUsers(query: string) {
  if (!query || query.length < 2) return []

  const users = await prisma.user.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { email: { contains: query, mode: 'insensitive' } },
        { studentId: { contains: query } },
      ],
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
    take: 5,
  })

  return users.map((u) => ({
    id: u.id,
    name: u.name ?? '',
    email: u.email ?? '',
  }))
}

export async function addMemberAction(formData: FormData) {
  const committeeId = formData.get('committeeId') as string
  const userId = formData.get('userId') as string
  const designation = formData.get('designation') as string

  if (!committeeId || !userId || !designation) {
    throw new Error('Missing required fields')
  }

  try {
    const existing = await prisma.committeeMember.findFirst({
      where: {
        committeeId,
        userId,
      },
    })

    if (existing) {
      return { success: false, message: 'User already added to this committee' }
    }

    await prisma.committeeMember.create({
      data: {
        committeeId,
        userId,
        designation,
      },
    })

    revalidateTag('committees', 'max')
    updateTag('committee_members')
    return { success: true }
  } catch (error) {
    console.error(error)
    throw new Error(
      error instanceof Error ? error.message : 'Failed to add member'
    )
  }
}

export async function getCommitteeWithMembers(session?: string) {
  'use cache'
  cacheLife('max')
  cacheTag('committee_members')
  const committee = await prisma.committee.findFirst({
    where: session ? { session } : { isCurrent: true },

    include: {
      members: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      },
    },
  })

  return committee
}

// for show envent page
export async function getAllCommittees() {
  'use cache'
  cacheTag('All-committees')
  return prisma.committee.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      id: true,
      session: true,
    },
  })
}

// ১. Delete Member
export async function deleteMemberAction(memberId: string) {
  try {
    await prisma.committeeMember.delete({ where: { id: memberId } })
    updateTag('committee_members')
    return { success: true }
  } catch (error) {
    return { error: 'Failed to delete member' }
  }
}

// ২. Edit Member Designation
export async function editMemberAction(
  memberId: string,
  newDesignation: string
) {
  try {
    await prisma.committeeMember.update({
      where: { id: memberId },
      data: { designation: newDesignation },
    })
    updateTag('committee_members')
    return { success: true }
  } catch (error) {
    return { error: 'Failed to update member' }
  }
}
