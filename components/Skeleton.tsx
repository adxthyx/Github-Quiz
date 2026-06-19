export function Skeleton({
  className = "",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`skeleton rounded-[14px] ${className}`}
      style={style}
      aria-hidden
    />
  );
}

/** Full quiz loading state — code panel + 2x2 choice cards shimmering. */
export function QuizSkeleton() {
  return (
    <div className="mx-auto grid w-full max-w-[1200px] grid-cols-1 gap-6 p-6 lg:grid-cols-12">
      <Skeleton
        className="rounded-[20px] lg:col-span-7"
        style={{ minHeight: 480 }}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton
            key={i}
            className="rounded-[20px]"
            style={{ minHeight: 132 }}
          />
        ))}
      </div>
    </div>
  );
}
