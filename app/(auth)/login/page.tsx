import { LoginForm } from '@/components/auth/login-form'

export default function Login() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-zinc-950">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-gray-100 bg-white p-8 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight dark:text-white">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-zinc-400">
            Sign in to your account
          </p>
        </div>

        <LoginForm />
      </div>
    </div>
  )
}
