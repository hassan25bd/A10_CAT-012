export default function SkeletonCard() {
  return (
    <div className="bg-dark-800 rounded-2xl overflow-hidden border border-gray-800/50 animate-pulse">
      <div className="h-56 skeleton" />
      <div className="p-4 space-y-3">
        <div className="h-4 skeleton rounded-lg w-4/5" />
        <div className="h-3 skeleton rounded-lg w-2/5" />
        <div className="flex justify-between items-center pt-1">
          <div className="h-5 skeleton rounded-lg w-16" />
          <div className="h-7 skeleton rounded-full w-24" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 5, cols = 4 }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 py-3 border-b border-gray-800/50">
          {Array.from({ length: cols }).map((_, j) => (
            <div key={j} className="flex-1 h-4 skeleton rounded-lg" />
          ))}
        </div>
      ))}
    </div>
  );
}
