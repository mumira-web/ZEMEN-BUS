export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-8">
          <div className="flex items-center justify-between">
            <div className="h-8 bg-muted rounded w-64"></div>
            <div className="h-10 bg-muted rounded w-32"></div>
          </div>
          <div className="h-10 bg-muted rounded"></div>
          <div className="h-96 bg-muted rounded"></div>
        </div>
      </div>
    </div>
  )
}
