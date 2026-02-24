import { Suspense } from 'react'

import { fetchUsersFromDB } from '@/actions/dashboardActions/UsersManagement'

import { columns } from './_Component/columns'
import { DataTable } from './_Component/data-table'

interface PageProps {
  searchParams: Promise<{ page?: string }>
}

async function UsersTable({ page }: { page: number }) {
  const { users, total, totalPages } = await fetchUsersFromDB(page, 10)

  return (
    <DataTable
      columns={columns}
      data={users}
      totalPages={totalPages}
      currentPage={page}
      total={total}
    />
  )
}

export default async function UserManagementPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams
  const currentPage = Number(resolvedParams.page ?? 1)

  return (
    <div>
      <Suspense fallback={<p>loading data...</p>}>
        <UsersTable page={currentPage} />
      </Suspense>
    </div>
  )
}
