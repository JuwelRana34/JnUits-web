import LogoutButton from '@/components/auth/LogoutButton'

export default function Home() {
  return (
    <div>
      <LogoutButton />
      <h1 className="text-2xl font-bold">Welcome to the Jnuits!</h1>

      {/* <Enable2FA /> */}
    </div>
  )
}
