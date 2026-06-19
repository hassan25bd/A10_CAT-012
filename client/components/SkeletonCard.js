export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-card">
      <div className="h-56 skeleton" />
      <div className="p-5 space-y-3">
        <div className="h-4 skeleton rounded-xl w-4/5" />
        <div className="h-3 skeleton rounded-xl w-2/5" />
        <div className="flex justify-between items-center pt-1">
          <div className="h-5 skeleton rounded-xl w-16" />
          <div className="h-7 skeleton rounded-xl w-24" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 5, cols = 4 }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 py-3 border-b border-slate-100">
          {Array.from({ length: cols }).map((_, j) => (
            <div key={j} className="flex-1 h-4 skeleton rounded-lg" />
          ))}
        </div>
      ))}
    </div>
  );
}
