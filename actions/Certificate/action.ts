'use server'

import { prisma } from '@/lib/prismadb'

export type CertificateResult = {
  success: boolean
  data?: {
    studentName: string
    examName: string
    createdAt: Date
  }
  error?: string
}

export async function verifyCertificateAction(
  certId: string
): Promise<CertificateResult> {
  if (!certId || certId.trim() === '') {
    return { success: false, error: 'ID is required' }
  }

  try {
    const certificate = await prisma.certificate.findUnique({
      where: {
        certId: certId.trim(),
      },
      select: {
        studentName: true,
        examName: true,
        createdAt: true,
      },
    })

    if (!certificate) {
      return { success: false, error: 'Not Found' }
    }

    return {
      success: true,
      data: certificate,
    }
  } catch (error) {
    console.error('Database Error:', error)
    return { success: false, error: 'Database connection failed' }
  }
}

export type BulkUploadDataType = {
  certId: string
  studentName: string
  examName: string
  phoneNumber?: string
  email?: string
}

export async function bulkUploadCertificates(data: BulkUploadDataType[]) {
  if (!data || data.length === 0) {
    return { success: false, message: 'No data provided' }
  }

  try {
    const result = await prisma.certificate.createMany({
      data: data.map((item) => ({
        certId: item.certId.toUpperCase().trim(),
        studentName: item.studentName.trim(),
        examName: item.examName.trim(),
        phoneNumber: item.phoneNumber?.trim() || null,
        email: item.email?.toLowerCase().trim() || null,
        isRevoked: false,
      })),
    })

    return {
      success: true,
      count: result.count,
      message: `Successfully uploaded ${result.count} certificates.`,
    }
  } catch (error) {
    console.error('Bulk Upload Error:', error)

    // Handle unique constraint (duplicate certId) errors specifically
    if ((error as { code?: string })?.code === 'P2002') {
      return {
        success: false,
        message: 'One or more Certificate IDs already exist in the database.',
      }
    }

    return { success: false, message: 'Failed to upload certificates.' }
  }
}
