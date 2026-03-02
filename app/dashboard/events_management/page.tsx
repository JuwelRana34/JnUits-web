import { RegistrationType } from '@prisma/client'

import { getAdminPaginatedEvents } from '@/actions/EventsActions/EventsManagementAction'

import { columns } from './_events_components/Columns'
import { DataTable } from './_events_components/Data-Table'
import EventCreationForm from './_events_components/EventForm'

interface PageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>
}

export default async function AdminEventsPage({ searchParams }: PageProps) {
  // Await searchParams for Next.js 14/15 compatibility
  const params = await searchParams

  const page = Number(params.page) || 1
  const search = params.search || ''
  const type = (params.type as RegistrationType | 'ALL') || 'ALL'
  const isActive = (params.isActive as 'true' | 'false' | 'ALL') || 'ALL'

  const { events, pagination } = await getAdminPaginatedEvents({
    page,
    limit: 10,
    search,
    type,
    isActive,
  })

  return (
    <div className="container mx-auto space-y-6 py-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Events Management</h1>
        <p className="text-muted-foreground">
          Manage your society events, workshops, and registrations.
        </p>
      </div>
      <EventCreationForm />
      <DataTable
        columns={columns}
        data={events || []}
        pagination={pagination}
      />
    </div>
  )
}
