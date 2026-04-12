import Link from "next/link";
import { CheckCircle2, ArrowRight, FileText } from "lucide-react";

export default function SuccessPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 md:p-8">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col items-center p-8 text-center">
          <div className="mb-4 rounded-full bg-green-100 p-3 text-green-600">
            <CheckCircle2 className="h-12 w-12" strokeWidth={2.5} />
          </div>
          <h1 className="mb-2 text-2xl font-bold tracking-tight text-slate-900">
            Payment Successful!
          </h1>
          <p className="mb-6 text-sm text-slate-500">
            Thank you for your purchase. Your payment has been processed successfully.
          </p>

          <div className="mb-8 w-full rounded-lg border border-slate-100 bg-slate-50 p-4 text-left text-sm">
            <div className="flex items-center justify-between py-2 border-b border-slate-200/60">
              <span className="text-slate-500">Transaction ID</span>
              <span className="font-medium text-slate-900">#TRX-{52256545}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-slate-500">Amount Paid</span>
              <span className="font-medium text-green-600">৳100.00</span>
            </div>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row">
            <Link 
              href="/profile" 
              className="flex flex-1 items-center justify-center gap-2 rounded-md bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-800"
            >
              Go to Dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}