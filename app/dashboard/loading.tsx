export default function Loading() {
  return (
    <div className="animate-pulse space-y-6 p-6">
      {/* Page title */}
      <div className="h-8 w-48 rounded bg-gray-200" />

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="h-24 rounded-lg bg-gray-200" />
        <div className="h-24 rounded-lg bg-gray-200" />
        <div className="h-24 rounded-lg bg-gray-200" />
        <div className="h-24 rounded-lg bg-gray-200" />
      </div>

      {/* Chart */}
      <div className="h-64 rounded-lg bg-gray-200" />

      {/* Table */}
      <div className="space-y-2">
        <div className="h-10 rounded-lg bg-gray-200" />
        <div className="h-10 rounded-lg bg-gray-100" />
        <div className="h-10 rounded-lg bg-gray-100" />
        <div className="h-10 rounded-lg bg-gray-100" />
        <div className="h-10 rounded-lg bg-gray-100" />
      </div>
    </div>
  )
}
