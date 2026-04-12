import Link from "next/link";
import { AlertCircle, ShoppingCart, ArrowLeft } from "lucide-react";

export default function CancelPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 md:p-8">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col items-center p-8 text-center">
          <div className="mb-4 rounded-full bg-amber-100 p-3 text-amber-600">
            <AlertCircle className="h-12 w-12" strokeWidth={2.5} />
          </div>
          <h1 className="mb-2 text-2xl font-bold tracking-tight text-slate-900">
            Payment Cancelled
          </h1>
          <p className="mb-8 text-sm text-slate-500">
            You have cancelled the payment process. Your order has not been placed. You can safely go back to your cart.
          </p>

          <div className="flex w-full flex-col gap-3 sm:flex-row">
            <Link 
              href="/" 
              className="flex flex-1 items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 transition-colors hover:bg-slate-100"
            >
              <ArrowLeft className="h-4 w-4" />
              Home
            </Link>
            <Link 
              href="/cart" 
              className="flex flex-1 items-center justify-center gap-2 rounded-md bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-800"
            >
              <ShoppingCart className="h-4 w-4" />
              View Cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}