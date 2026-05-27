import { Emblem } from "./Emblem";

export function Logo() {
  return (
    <div className="flex items-center gap-3">
      <Emblem />
      <h1 className="font-heading text-3xl font-black leading-none">
        <span style={{ color: "var(--ink)" }}>Kairos </span>
        <span style={{ color: "var(--green)" }}>NGN</span>
      </h1>
    </div>
  );
}
