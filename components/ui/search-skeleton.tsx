import { Skeleton } from "@/components/ui/skeleton"

export function SearchSkeleton() {
  return (
    <div className="p-4 space-y-4">
      {[...Array(3)].map((_, idx) => (
        <div key={idx} className="space-y-2">
          <Skeleton className="h-4 w-1/3" />
          {[...Array(3)].map((__, i) => (
            <Skeleton key={i} className="h-6 w-full" />
          ))}
        </div>
      ))}
    </div>
  )
}
