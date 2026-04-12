import Link from "next/link";
import { XCircle, RefreshCcw, Home } from "lucide-react";

export default function FailPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 md:p-8">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col items-center p-8 text-center">
          <div className="mb-4 rounded-full bg-red-100 p-3 text-red-600">
            <XCircle className="h-12 w-12" strokeWidth={2.5} />
          </div>
          <h1 className="mb-2 text-2xl font-bold tracking-tight text-slate-900">
            Payment Failed
          </h1>
          <p className="mb-8 text-sm text-slate-500">
            We couldn't process your payment. This might be due to a network issue or insufficient funds. Please try again.
          </p>

          <div className="flex w-full flex-col gap-3">
            <Link 
              href="/events" 
              className="flex w-full items-center justify-center gap-2 rounded-md bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700"
            >
              <RefreshCcw className="h-4 w-4" />
              Try Again
            </Link>
            <Link 
              href="/" 
              className="flex w-full items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              <Home className="h-4 w-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}