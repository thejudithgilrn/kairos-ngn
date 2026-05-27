export function Emblem({ size = 52 }: { size?: number }) {
  return (
    <div
      className="grid place-items-center rounded-full"
      style={{ width: size, height: size, backgroundColor: "var(--green)" }}
    >
      <span
        className="font-heading text-2xl font-black"
        style={{ color: "var(--gold-light)" }}
      >
        K
      </span>
    </div>
  );
}
