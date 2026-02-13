'use client'

import { useRouter, useSearchParams } from 'next/navigation'

import { ChevronLeft, ChevronRight } from 'lucide-react'

import { Button } from '@/components/ui/button'

interface PaginationControlsProps {
  metadata: {
    currentPage: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

export function PaginationControls({ metadata }: PaginationControlsProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', newPage.toString())
    router.push(`?${params.toString()}`)
  }

  return (
    <div className="mt-8 flex items-center justify-center gap-4">
      <Button
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(metadata.currentPage - 1)}
        disabled={!metadata.hasPrevPage}
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        Previous
      </Button>

      <span className="text-muted-foreground text-sm">
        Page {metadata.currentPage} of {metadata.totalPages}
      </span>

      <Button
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(metadata.currentPage + 1)}
        disabled={!metadata.hasNextPage}
      >
        Next
        <ChevronRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  )
}
