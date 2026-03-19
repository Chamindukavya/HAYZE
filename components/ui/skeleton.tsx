export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-zinc-800 rounded ${className}`} />
  );
}

export function ProductSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="aspect-[3/4] w-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/4" />
      </div>
    </div>
  );
}
