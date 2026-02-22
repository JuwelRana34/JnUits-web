'use server'

import { cacheLife, cacheTag } from 'next/cache'

import { prisma } from '@/lib/prismadb'

export async function getDashboardStats() {
  'use cache'
  cacheTag('dashboard-stats', 'max')
  cacheLife('default')
  try {
    const [totalUsers, totalEvents, totalRegistrations, totalRevenue] =
      await Promise.all([
        prisma.user.count(),
        prisma.event.count(),
        prisma.registration.count(),
        prisma.payment.findMany({
          where: { status: 'COMPLETED' },
          select: { amount: true },
        }),
      ])

    const revenue = totalRevenue.reduce(
      (acc, curr) => acc + (parseFloat(curr.amount) || 0),
      0
    )

    return {
      totalUsers,
      totalEvents,
      totalRegistrations,
      revenue,
      success: true,
    }
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return {
      totalUsers: 0,
      totalEvents: 0,
      totalRegistrations: 0,
      revenue: 0,
      success: false,
    }
  }
}

export async function getTrafficData() {
  'use cache'

  try {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const [users, sessions] = await Promise.all([
      prisma.user.findMany({
        where: { createdAt: { gte: thirtyDaysAgo } },
        select: { createdAt: true },
      }),
      prisma.session.findMany({
        where: { createdAt: { gte: thirtyDaysAgo } },
        select: { createdAt: true },
      }),
    ])

    // Group by day
    const trafficMap = new Map<string, { signups: number; visitors: number }>()

    // Initialize last 14 days
    for (let i = 0; i < 14; i++) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const dateStr = d.toISOString().split('T')[0]
      trafficMap.set(dateStr, { signups: 0, visitors: 0 })
    }

    users.forEach((u) => {
      const dateStr = u.createdAt.toISOString().split('T')[0]
      if (trafficMap.has(dateStr)) {
        const entry = trafficMap.get(dateStr)!
        entry.signups += 1
      }
    })

    sessions.forEach((s) => {
      const dateStr = s.createdAt.toISOString().split('T')[0]
      if (trafficMap.has(dateStr)) {
        const entry = trafficMap.get(dateStr)!
        entry.visitors += 1
      }
    })

    // Convert to array and sort by date ASC
    const data = Array.from(trafficMap.entries())
      .map(([date, counts]) => ({ date, ...counts }))
      .sort((a, b) => a.date.localeCompare(b.date))

    return { data, success: true }
  } catch (error) {
    console.error('Error fetching traffic data', error)
    return { data: [], success: false }
  }
}

export async function getRecentActivity() {
  'use cache'
  cacheTag('recent-activity')
  cacheLife('default')

  try {
    const [registrations, users, posts, payments] = await Promise.all([
      prisma.registration.findMany({
        take: 3,
        orderBy: { appliedAt: 'desc' },
        include: {
          user: { select: { name: true, image: true } },
          event: { select: { title: true } },
        },
      }),
      prisma.user.findMany({
        take: 3,
        orderBy: { createdAt: 'desc' },
        select: { id: true, name: true, image: true, createdAt: true },
      }),
      prisma.post.findMany({
        take: 3,
        orderBy: { createdAt: 'desc' },
        include: { author: { select: { name: true, image: true } } },
      }),
      prisma.payment.findMany({
        take: 3,
        where: { status: 'COMPLETED' },
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { name: true, image: true } } },
      }),
    ])

    const combined = [
      ...registrations.map((r) => ({
        id: r.id,
        type: 'REGISTRATION' as const,
        userName: r.user?.name || 'Unknown',
        userImage: r.user?.image,
        target: r.event?.title,
        timestamp: r.appliedAt.toISOString(),
      })),
      ...users.map((u) => ({
        id: u.id,
        type: 'SIGNUP' as const,
        userName: u.name,
        userImage: u.image,
        target: 'joined the community',
        timestamp: u.createdAt.toISOString(),
      })),
      ...posts.map((p) => ({
        id: p.id,
        type: 'POST' as const,
        userName: p.author.name,
        userImage: p.author.image,
        target: p.title,
        timestamp: p.createdAt?.toISOString() || '',
      })),
      ...payments.map((p) => ({
        id: p.id,
        type: 'PAYMENT' as const,
        userName: p.user?.name || 'Unknown',
        userImage: p.user?.image,
        target: `paid ${p.amount} BDT`,
        timestamp: p.createdAt.toISOString(),
      })),
    ]

    return combined
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
      .slice(0, 6)
  } catch (error) {
    console.error('Activity fetch error:', error)
    return []
  }
}
