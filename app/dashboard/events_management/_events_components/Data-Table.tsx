'use client'

import * as React from 'react'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  pagination?: { total: number; pages: number; currentPage: number } | null
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pagination,
}: DataTableProps<TData, TValue>) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  // Helper to update URL params
  const createQueryString = React.useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)
      if (name !== 'page') params.set('page', '1') // Reset page on filter change
      return params.toString()
    },
    [searchParams]
  )

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Debounce this in a real app, keeping it simple here
    router.push(`${pathname}?${createQueryString('search', e.target.value)}`)
  }

  return (
    <div className="space-y-4">
      {/* Filters & Actions Header */}
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <Input
          placeholder="Search events..."
          defaultValue={searchParams.get('search') ?? ''}
          onChange={handleSearch}
          className="max-w-sm"
        />
        <div className="flex w-full gap-2 sm:w-auto">
          <Select
            defaultValue={searchParams.get('type') ?? 'ALL'}
            onValueChange={(val) =>
              router.push(`${pathname}?${createQueryString('type', val)}`)
            }
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Event Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Types</SelectItem>
              <SelectItem value="MEMBER_APPLY">Member Apply</SelectItem>
              <SelectItem value="WORKSHOP">Workshop</SelectItem>
              <SelectItem value="BCC_COURSE">BCC Course</SelectItem>
            </SelectContent>
          </Select>

          <Select
            defaultValue={searchParams.get('isActive') ?? 'ALL'}
            onValueChange={(val) =>
              router.push(`${pathname}?${createQueryString('isActive', val)}`)
            }
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Status</SelectItem>
              <SelectItem value="true">Active</SelectItem>
              <SelectItem value="false">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table Area */}
      <div className="bg-card overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No events found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Server-Side Pagination Controls */}
      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              router.push(
                `${pathname}?${createQueryString('page', String(pagination.currentPage - 1))}`
              )
            }
            disabled={pagination.currentPage <= 1}
          >
            Previous
          </Button>
          <div className="text-sm font-medium">
            Page {pagination.currentPage} of {pagination.pages}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              router.push(
                `${pathname}?${createQueryString('page', String(pagination.currentPage + 1))}`
              )
            }
            disabled={pagination.currentPage >= pagination.pages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}
