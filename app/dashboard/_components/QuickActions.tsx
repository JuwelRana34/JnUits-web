import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function QuickActions() {
  return (
    <Card className="border-dashed bg-linear-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 md:col-span-1">
      <CardHeader>
        <CardTitle className="text-base">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-2">
        <button className="bg-background hover:bg-accent rounded border p-2 text-xs transition-colors">
          Add User
        </button>
        <button className="bg-background hover:bg-accent rounded border p-2 text-xs transition-colors">
          Settings
        </button>
      </CardContent>
    </Card>
  )
}
