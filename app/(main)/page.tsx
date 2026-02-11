import LogoutButton from '@/components/auth/LogoutButton'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <LogoutButton />
      <h1 className="text-2xl font-bold">
        Welcome to the Jnuits! something comming soon ...{' '}
      </h1>
    </div>
  )
}
