// "use client";

// import { verifyCertificateAction } from '@/actions/Certificate/action';
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Separator } from "@/components/ui/separator";
// import {
//     AlertCircle,
//     Award,
//     Calendar,
//     CheckCircle2,
//     Loader2,
//     Mail,
//     Search,
//     ShieldCheck,
//     User
// } from 'lucide-react';
// import { useRouter, useSearchParams } from 'next/navigation';
// import React, { Suspense, useEffect, useState } from 'react';

// interface CertificateData {
//   studentName: string;
//   examName: string;
//   createdAt: Date | string;

// }

// const VerifyContent = () => {
//   const searchParams = useSearchParams();
//   const router = useRouter();

//   // URL parameter handle: checks for '?q='
//   const queryId = searchParams.get('q');

//   const [certId, setCertId] = useState(queryId || '');
//   const [data, setData] = useState<CertificateData | null>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isNotFound, setIsNotFound] = useState(false);

// const performVerification = async (id: string) => {
//     if (!id.trim()) return;

//     setIsLoading(true);
//     setData(null);
//     setIsNotFound(false);

//     // CALLING SERVER ACTION DIRECTLY
//     const result = await verifyCertificateAction(id);

//     if (result.success && result.data) {
//       setData(result.data);
//     } else {
//       setIsNotFound(true);
//     }
//     setIsLoading(false);
//   };

//   useEffect(() => {
//     const checkCertificates =()=>{
//          if (queryId) {
//       setCertId(queryId);
//       performVerification(queryId);
//     }
//     }
//    checkCertificates();
//   }, [queryId]);

//   const handleManualVerify = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!certId) return;

//     // Update URL param for shareability
//     router.push(`/certificates?q=${certId}`, { scroll: false });
//     performVerification(certId);
//   };

//   return (
//     <Card className="w-full max-w-lg shadow-2xl border-t-4 border-t-primary animate-in fade-in zoom-in duration-500">
//       <CardHeader className="text-center space-y-2">
//         <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-2 shadow-inner">
//           <ShieldCheck className="w-10 h-10 text-primary" />
//         </div>
//         <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">
//           Certificate Verification
//         </CardTitle>
//         <CardDescription className="text-muted-foreground">
//           Scan QR or enter ID to verify authenticity
//         </CardDescription>
//       </CardHeader>

//       <CardContent className="space-y-6">
//         <form onSubmit={handleManualVerify} className="flex gap-2">
//           <div className="relative flex-1">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
//             <Input
//               placeholder="Enter Certificate ID..."
//               className="pl-10 h-11 border-slate-200 focus-visible:ring-primary"
//               value={certId}
//               onChange={(e) => setCertId(e.target.value)}
//             />
//           </div>
//           <Button type="submit" className="font-semibold px-6 h-11 shadow-md hover:shadow-lg transition-all" disabled={isLoading}>
//             {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify"}
//           </Button>
//         </form>

//         {/* --- VALID STATE --- */}
//         {data && (
//           <div className="animate-in slide-in-from-bottom-4 duration-500">
//             <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6">
//               <div className="flex items-center gap-3 text-emerald-700 font-semibold mb-2">
//                 <CheckCircle2 className="w-5 h-5" />
//                 Valid Credential
//               </div>
//               <p className="text-emerald-800/80 text-sm leading-relaxed">
//                 <span className="font-bold text-emerald-900">{data.studentName}</span> has successfully completed the
//                 <span className="font-medium text-emerald-900"> {data.examName} </span>
//                 with <Badge className="bg-yellow-600 ml-1 h-5">Merit</Badge>
//               </p>
//             </div>

//             <div className="space-y-3">
//               <DetailRow icon={<User className="w-4 h-4 text-primary" />} label="Student Name" value={data.studentName} />
//               <DetailRow icon={<Award className="w-4 h-4 text-primary" />} label="Course Name" value={data.examName} />
//               <DetailRow
//                 icon={<Calendar className="w-4 h-4 text-primary" />}
//                 label="Issued On"
//                 value={new Date(data.createdAt).toLocaleDateString('en-US', {
//                   month: 'short', day: 'numeric', year: 'numeric'
//                 })}
//               />
//             </div>
//           </div>
//         )}

//         {/* --- NOT FOUND STATE --- */}
//         {isNotFound && (
//           <div className="animate-in slide-in-from-bottom-4 duration-500">
//             <div className="bg-red-50 border border-red-200 rounded-lg p-5 shadow-sm">
//               <div className="flex items-center gap-3 text-red-700 font-bold mb-3">
//                 <AlertCircle className="w-5 h-5" />
//                 Certificate Not Found
//               </div>
//               <div className="text-red-700/80 text-sm leading-relaxed space-y-4">
//                 <p>
//                   The Certificate ID <span className="font-mono font-bold">{certId}</span> was not found in our records.
//                   If you think this is a mistake, please contact us:
//                 </p>
//                 <div className="flex items-center gap-2 bg-white/60 p-2.5 rounded-md border border-red-100 w-fit">
//                   <Mail className="w-4 h-4 text-red-700" />
//                   <a href="mailto:info@jnuits.org.bd" className="font-bold text-red-800 hover:underline">
//                     info@jnuits.org.bd
//                   </a>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </CardContent>

//       <CardFooter className="flex flex-col items-center pb-6">
//         <Separator className="mb-4 opacity-50" />
//         <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em] text-center">
//           JnU IT Society Verification Portal
//         </p>
//       </CardFooter>
//     </Card>
//   );
// };

// const DetailRow = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
//   <div className="flex items-center justify-between p-3.5 bg-white rounded-lg border border-slate-100 shadow-sm hover:border-primary/20 transition-colors">
//     <div className="flex items-center gap-3 text-slate-500">
//       {icon}
//       <span className="font-medium text-xs uppercase tracking-wider">{label}</span>
//     </div>
//     <span className="font-bold text-slate-900 text-sm">{value}</span>
//   </div>
// );

// // Main entry point with Suspense for Next.js SearchParams
// const CertificateVerify = () => {
//   return (
//     <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 selection:bg-primary/10">
//       <Suspense fallback={
//         <div className="flex flex-col items-center gap-3">
//           <Loader2 className="w-10 h-10 animate-spin text-primary" />
//           <p className="text-sm font-medium text-slate-500">Initializing System...</p>
//         </div>
//       }>
//         <VerifyContent />
//       </Suspense>
//     </div>
//   );
// };

// export default CertificateVerify;

'use client'

import React, {
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'

import { useRouter, useSearchParams } from 'next/navigation'

import {
  AlertCircle,
  Award,
  Calendar,
  CheckCircle2,
  Loader2,
  Mail,
  Search,
  ShieldCheck,
  User,
} from 'lucide-react'

import { verifyCertificateAction } from '@/actions/Certificate/action'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

interface CertificateData {
  studentName: string
  examName: string
  createdAt: Date | string
}

// ─── Result area: the ONLY part that changes dynamically ──────────────────────
const ResultArea = ({
  isLoading,
  data,
  isNotFound,
  certId,
}: {
  isLoading: boolean
  data: CertificateData | null
  isNotFound: boolean
  certId: string
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 py-6 text-slate-400">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span className="text-sm font-medium">Verifying...</span>
      </div>
    )
  }

  if (data) {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
          <div className="mb-2 flex items-center gap-3 font-semibold text-emerald-700">
            <CheckCircle2 className="h-5 w-5" />
            Valid Credential
          </div>
          <p className="text-sm leading-relaxed text-emerald-800/80">
            <span className="font-bold text-emerald-900">
              {data.studentName}
            </span>{' '}
            has successfully completed the{' '}
            <span className="font-medium text-emerald-900">
              {data.examName}
            </span>{' '}
            with <Badge className="ml-1 h-5 bg-yellow-600">Merit</Badge>
          </p>
        </div>
        <div className="space-y-3">
          <DetailRow
            icon={<User className="text-primary h-4 w-4" />}
            label="Student Name"
            value={data.studentName}
          />
          <DetailRow
            icon={<Award className="text-primary h-4 w-4" />}
            label="Course Name"
            value={data.examName}
          />
          <DetailRow
            icon={<Calendar className="text-primary h-4 w-4" />}
            label="Issued On"
            value={new Date(data.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          />
        </div>
      </div>
    )
  }

  if (isNotFound) {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="rounded-lg border border-red-200 bg-red-50 p-5">
          <div className="mb-3 flex items-center gap-3 font-bold text-red-700">
            <AlertCircle className="h-5 w-5" />
            Certificate Not Found
          </div>
          <div className="space-y-3 text-sm leading-relaxed text-red-700/80">
            <p>
              The Certificate ID{' '}
              <span className="font-mono font-bold">{certId}</span> was not
              found in our records. If you think this is a mistake, please
              contact us:
            </p>
            <div className="flex w-fit items-center gap-2 rounded-md border border-red-100 bg-white/60 p-2.5">
              <Mail className="h-4 w-4 text-red-700" />
              <a
                href="mailto:info@jnuits.org.bd"
                className="font-bold text-red-800 hover:underline"
              >
                info@jnuits.org.bd
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}

// ─── Detail row ───────────────────────────────────────────────────────────────
const DetailRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) => (
  <div className="hover:border-primary/20 flex items-center justify-between rounded-lg border border-slate-100 bg-white p-3.5 shadow-sm transition-colors">
    <div className="flex items-center gap-3 text-slate-500">
      {icon}
      <span className="text-xs font-medium tracking-wider uppercase">
        {label}
      </span>
    </div>
    <span className="text-sm font-bold">{value}</span>
  </div>
)

// ─── Main content ─────────────────────────────────────────────────────────────
const VerifyContent = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const queryId = searchParams.get('q')

  const [certId, setCertId] = useState(queryId || '')
  const [data, setData] = useState<CertificateData | null>(null)
  const [isLoading, setIsLoading] = useState(!!queryId) // true from start if ?q= exists
  const [isNotFound, setIsNotFound] = useState(false)
  const hasAutoVerified = useRef(false)

  const performVerification = useCallback(async (id: string) => {
    if (!id.trim()) return
    setIsLoading(true)
    setData(null)
    setIsNotFound(false)
    const result = await verifyCertificateAction(id)
    if (result.success && result.data) {
      setData(result.data)
    } else {
      setIsNotFound(true)
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    const checkFc = () => {
      if (queryId && !hasAutoVerified.current) {
        hasAutoVerified.current = true
        setCertId(queryId)
        performVerification(queryId)
      }
    }
    checkFc()
  }, [queryId, performVerification])

  const handleManualVerify = (e: React.FormEvent) => {
    e.preventDefault()
    if (!certId.trim()) return
    router.push(`/certificates?q=${certId}`, { scroll: false })
    performVerification(certId)
  }

  return (
    // ✅ No animate-in on Card — fully static, never blinks
    <Card className="border-t-primary w-full max-w-lg border-t-4 shadow-2xl">
      <CardHeader className="space-y-2 text-center">
        <div className="bg-primary/10 mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full shadow-inner">
          <ShieldCheck className="text-primary h-10 w-10" />
        </div>
        <CardTitle className="bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-2xl font-bold tracking-tight text-transparent">
          Certificate Verification
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Scan QR or enter ID to verify authenticity
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <form onSubmit={handleManualVerify} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder="Enter Certificate ID..."
              className="focus-visible:ring-primary h-11 border-slate-200 pl-10"
              value={certId}
              onChange={(e) => setCertId(e.target.value)}
            />
          </div>
          <Button
            type="submit"
            className="h-11 px-6 font-semibold shadow-md transition-all hover:shadow-lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              'Verify'
            )}
          </Button>
        </form>

        {/* ✅ Only this area updates — everything above stays perfectly still */}
        <ResultArea
          isLoading={isLoading}
          data={data}
          isNotFound={isNotFound}
          certId={certId}
        />
      </CardContent>

      <CardFooter className="flex flex-col items-center pb-6">
        <Separator className="mb-4 opacity-50" />
        <p className="text-muted-foreground text-[10px] font-black tracking-[0.2em] uppercase">
          JnU IT Society Verification Portal
        </p>
      </CardFooter>
    </Card>
  )
}

// ─── Page wrapper ─────────────────────────────────────────────────────────────
const CertificateVerify = () => {
  return (
    <div className="selection:bg-primary/10 flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Suspense
        fallback={
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="text-primary h-10 w-10 animate-spin" />
            <p className="text-sm font-medium text-slate-500">
              Initializing...
            </p>
          </div>
        }
      >
        <VerifyContent />
      </Suspense>
    </div>
  )
}

export default CertificateVerify
