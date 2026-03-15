interface LoadingRowsProps {
  rows?: number
}

export const LoadingRows = ({ rows = 8 }: LoadingRowsProps) => (
  <div className="space-y-2">
    {Array.from({ length: rows }).map((_, index) => (
      <div
        key={`loading-row-${index}`}
        className="h-9 animate-pulse border border-nothing-700 bg-nothing-800"
      />
    ))}
  </div>
)
