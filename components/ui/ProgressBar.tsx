export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-1 w-full overflow-hidden rounded-full bg-stone-200">
      <div
        className="h-full"
        style={{ width: `${Math.max(0, Math.min(100, value))}%`, background: "var(--green)" }}
      />
    </div>
  );
}
