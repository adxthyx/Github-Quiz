export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-8" aria-busy="true">
      <div className="mb-5 space-y-2">
        <div className="flex justify-between">
          <div className="skeleton h-3 w-28 rounded-sm" />
          <div className="skeleton h-3 w-16 rounded-sm" />
        </div>
        <div className="skeleton h-1 w-full rounded-full" />
      </div>

      <div className="mb-4 flex gap-2">
        <div className="skeleton h-8 w-24 rounded-sm" />
        <div className="skeleton h-8 w-24 rounded-sm" />
        <div className="skeleton h-8 w-24 rounded-sm" />
      </div>

      <div className="skeleton h-64 w-full rounded-lg" />

      <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton h-12 w-full rounded-md" />
        ))}
      </div>
    </div>
  );
}
