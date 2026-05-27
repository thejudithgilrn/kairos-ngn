import { PropsWithChildren } from "react";
import clsx from "clsx";

export function Card({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={clsx("rounded-sm border p-6", className)}
      style={{ background: "var(--white)", borderColor: "var(--rule)" }}
    >
      {children}
    </div>
  );
}
