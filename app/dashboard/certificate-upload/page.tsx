'use client'

import React, { useCallback, useRef, useState } from 'react'

import {
  AlertTriangle,
  CheckCircle,
  FileText,
  Loader2,
  Upload,
  X,
  XCircle,
} from 'lucide-react'
import Papa from 'papaparse'

import {
  BulkUploadDataType,
  bulkUploadCertificates,
} from '@/actions/Certificate/action'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'

// ─── Constants ────────────────────────────────────────────────────────────────

const REQUIRED_COLUMNS: (keyof BulkUploadDataType)[] = [
  'certId',
  'studentName',
  'examName',
  'phoneNumber',
  'email',
]

const MAX_FILE_SIZE_MB = 5
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024

// ─── Types ────────────────────────────────────────────────────────────────────

type UploadStatus = 'idle' | 'parsing' | 'validating' | 'uploading' | 'done'

interface StatusMessage {
  type: 'success' | 'error' | 'warning'
  title: string
  detail?: string
}

interface ParsedFile {
  name: string
  rowCount: number
  data: BulkUploadDataType[]
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function validateHeaders(headers: string[]): string | null {
  const missing = REQUIRED_COLUMNS.filter((col) => !headers.includes(col))
  if (missing.length > 0) {
    return `Missing required columns: ${missing.join(', ')}`
  }
  return null
}

function validateRows(
  rows: BulkUploadDataType[]
): { rowIndex: number; reason: string }[] {
  const errors: { rowIndex: number; reason: string }[] = []

  rows.forEach((row, i) => {
    const rowNum = i + 2 // 1-indexed + header row

    if (!row.certId?.trim()) {
      errors.push({ rowIndex: rowNum, reason: 'certId is empty' })
    }
    if (!row.studentName?.trim()) {
      errors.push({ rowIndex: rowNum, reason: 'studentName is empty' })
    }
    if (!row.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)) {
      errors.push({ rowIndex: rowNum, reason: 'email is invalid' })
    }
  })

  return errors
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminUploadPage() {
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle')
  const [statusMessage, setStatusMessage] = useState<StatusMessage | null>(null)
  const [parsedFile, setParsedFile] = useState<ParsedFile | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const reset = useCallback(() => {
    setUploadStatus('idle')
    setStatusMessage(null)
    setParsedFile(null)
    if (inputRef.current) inputRef.current.value = ''
  }, [])

  const processFile = useCallback(async (file: File) => {
    // ── File-level validation ──────────────────────────────────────────────
    if (!file.name.endsWith('.csv')) {
      setStatusMessage({
        type: 'error',
        title: 'Invalid file type',
        detail: 'Only .csv files are accepted.',
      })
      return
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setStatusMessage({
        type: 'error',
        title: 'File too large',
        detail: `Maximum allowed size is ${MAX_FILE_SIZE_MB} MB.`,
      })
      return
    }

    setStatusMessage(null)
    setUploadStatus('parsing')

    // ── Parse CSV ─────────────────────────────────────────────────────────
    Papa.parse<BulkUploadDataType>(file, {
      header: true,
      skipEmptyLines: true,

      complete: async (results) => {
        // ── Header validation ──────────────────────────────────────────────
        setUploadStatus('validating')
        const headers = results.meta.fields ?? []
        const headerError = validateHeaders(headers)

        if (headerError) {
          setStatusMessage({ type: 'error', title: headerError })
          setUploadStatus('idle')
          return
        }

        const rows = results.data

        if (rows.length === 0) {
          setStatusMessage({
            type: 'warning',
            title: 'Empty file',
            detail: 'The CSV contains no data rows.',
          })
          setUploadStatus('idle')
          return
        }

        // ── Row-level validation ───────────────────────────────────────────
        const rowErrors = validateRows(rows)

        if (rowErrors.length > 0) {
          const sample = rowErrors
            .slice(0, 3)
            .map((e) => `Row ${e.rowIndex}: ${e.reason}`)
            .join(' · ')
          const extra =
            rowErrors.length > 3 ? ` (+${rowErrors.length - 3} more)` : ''

          setStatusMessage({
            type: 'error',
            title: `${rowErrors.length} validation error(s) found`,
            detail: sample + extra,
          })
          setUploadStatus('idle')
          return
        }

        setParsedFile({ name: file.name, rowCount: rows.length, data: rows })

        // ── Upload ─────────────────────────────────────────────────────────
        setUploadStatus('uploading')

        try {
          const response = await bulkUploadCertificates(rows)

          setStatusMessage({
            type: response.success ? 'success' : 'error',
            title: response.message,
          })
        } catch (err) {
          console.error('Upload error:', err)
          setStatusMessage({
            type: 'error',
            title: 'Upload failed',
            detail: 'An unexpected server error occurred. Please try again.',
          })
        } finally {
          setUploadStatus('done')
        }
      },

      error: (error) => {
        console.error('CSV parse error:', error)
        setStatusMessage({
          type: 'error',
          title: 'Failed to parse CSV',
          detail: error.message,
        })
        setUploadStatus('idle')
      },
    })
  }, [])

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) processFile(file)
    },
    [processFile]
  )

  // ── Drag-and-drop handlers ─────────────────────────────────────────────────
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback(() => setIsDragging(false), [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files?.[0]
      if (file) processFile(file)
    },
    [processFile]
  )

  // ── Derived state ──────────────────────────────────────────────────────────
  const isBusy =
    uploadStatus === 'parsing' ||
    uploadStatus === 'validating' ||
    uploadStatus === 'uploading'

  const statusLabel: Record<Exclude<UploadStatus, 'idle' | 'done'>, string> = {
    parsing: 'Parsing CSV…',
    validating: 'Validating rows…',
    uploading: 'Uploading to server…',
  }

  return (
    <div className="container mx-auto flex justify-center py-10">
      <Card className="w-full max-w-lg shadow-lg">
        {/* ── Header ── */}
        <CardHeader className="pb-4 text-center">
          <div className="bg-primary/10 mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full">
            <Upload className="text-primary h-7 w-7" />
          </div>
          <CardTitle className="text-xl">Bulk Certificate Upload</CardTitle>
          <CardDescription>
            Upload a CSV to add multiple certificates at once. Max{' '}
            {MAX_FILE_SIZE_MB} MB.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* ── Drop Zone ── */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !isBusy && inputRef.current?.click()}
            className={`relative flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-8 transition-colors ${isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/30 hover:border-primary/50 hover:bg-muted/30'} ${isBusy ? 'pointer-events-none opacity-60' : ''} `}
          >
            <FileText className="text-muted-foreground h-8 w-8" />
            <p className="text-center text-sm font-medium">
              {isDragging
                ? 'Drop your CSV here'
                : 'Drag & drop a CSV, or click to browse'}
            </p>
            <p className="text-muted-foreground text-center text-xs">
              Required columns:{' '}
              <code className="bg-muted rounded px-1 text-[11px]">
                {REQUIRED_COLUMNS.join(', ')}
              </code>
            </p>

            {/* Hidden file input */}
            <Input
              ref={inputRef}
              id="csv-upload"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              disabled={isBusy}
              className="hidden"
            />
          </div>

          {/* ── File Info Badge ── */}
          {parsedFile && (
            <div className="bg-muted flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm">
              <div className="flex min-w-0 items-center gap-2">
                <FileText className="text-muted-foreground h-4 w-4 shrink-0" />
                <span className="truncate font-medium">{parsedFile.name}</span>
                <span className="text-muted-foreground shrink-0">
                  · {parsedFile.rowCount} rows
                </span>
              </div>
              {!isBusy && (
                <button
                  onClick={reset}
                  className="text-muted-foreground hover:text-foreground shrink-0 transition-colors"
                  aria-label="Clear file"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          )}

          {/* ── Progress Indicator ── */}
          {isBusy && (
            <div className="text-muted-foreground flex items-center justify-center gap-2 text-sm">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="animate-pulse">
                {statusLabel[uploadStatus as keyof typeof statusLabel]}
              </span>
            </div>
          )}

          {/* ── Status Message ── */}
          {statusMessage && !isBusy && (
            <StatusBanner message={statusMessage} onDismiss={reset} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// ─── Status Banner ─────────────────────────────────────────────────────────────

function StatusBanner({
  message,
  onDismiss,
}: {
  message: StatusMessage
  onDismiss: () => void
}) {
  const styles = {
    success: {
      wrapper: 'bg-emerald-50 border-emerald-200 text-emerald-800',
      icon: <CheckCircle className="mt-0.5 h-5 w-5 shrink-0" />,
    },
    error: {
      wrapper: 'bg-red-50 border-red-200 text-red-800',
      icon: <XCircle className="mt-0.5 h-5 w-5 shrink-0" />,
    },
    warning: {
      wrapper: 'bg-amber-50 border-amber-200 text-amber-800',
      icon: <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />,
    },
  }[message.type]

  return (
    <div
      className={`flex items-start gap-3 rounded-lg border p-4 ${styles.wrapper}`}
    >
      {styles.icon}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">{message.title}</p>
        {message.detail && (
          <p className="mt-0.5 text-xs break-words opacity-80">
            {message.detail}
          </p>
        )}
      </div>
      <button
        onClick={onDismiss}
        className="shrink-0 opacity-60 transition-opacity hover:opacity-100"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
