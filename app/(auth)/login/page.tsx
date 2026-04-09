import { LoginForm } from '@/components/auth/login-form'

export default function Login() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-1 dark:bg-transparent ">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-gray-100 bg-white p-8 shadow-xl dark:border-zinc-800 dark:backdrop-blur-sm dark:bg-white/10">
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
