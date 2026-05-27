import { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost";
};

export function Button({ className, variant = "primary", ...props }: Props) {
  return (
    <button
      className={clsx(
        "px-4 py-2 text-sm font-semibold transition",
        variant === "primary" && "text-white",
        variant === "ghost" && "bg-transparent",
        className
      )}
      style={{
        borderRadius: 2,
        background: variant === "primary" ? "var(--green)" : "transparent",
        border:
          variant === "ghost" ? "1px solid var(--gold)" : "1px solid transparent",
        fontFamily: "var(--font-inter)",
      }}
      {...props}
    />
  );
}
