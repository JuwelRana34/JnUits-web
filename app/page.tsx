import Skeleton from '@/components/shared/Skeleton'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 font-sans dark:bg-zinc-900">
      <h1 className="text-4xl font-bold">
        Welcome to Next.js! statter template💥💬
      </h1>
      <br />
      <div>
        <Skeleton className="m-4 h-30 w-48 rounded-md" />
      </div>
      <div className="bg-background text-foreground border-border border p-5">
        <h1 className="text-xl">হ্যালো জুয়েল রানা!</h1>
        <button className="bg-primary text-primary-foreground rounded-lg p-2">
          ক্লিক করুন
        </button>
      </div>
    </div>
  )
}
