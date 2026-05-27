import Link from "next/link";
import { Logo } from "@/components/brand/Logo";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="border-b p-4" style={{ borderColor: "var(--rule)" }}>
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Logo />
          <nav className="font-ui flex gap-4 text-xs uppercase tracking-wider">
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/upgrade">Upgrade</Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl p-4">{children}</main>
    </div>
  );
}
