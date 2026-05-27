import Link from "next/link";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { Logo } from "@/components/brand/Logo";
import { Card } from "@/components/ui/Card";

export default function Home() {
  return (
    <div className="min-h-screen px-4 py-10">
      <main className="mx-auto flex max-w-2xl flex-col items-center gap-6">
        <Logo />
        <p className="kicker text-center">
          NEXT GENERATION NCLEX · CLINICAL REASONING PLATFORM
        </p>
        <p className="font-copy text-center text-base italic text-stone-700">
          Develop the judgment the exam now tests — not just the answers it accepts.
        </p>
        <Card className="w-full border-t-4" >
          <RegisterForm />
        </Card>
        <div className="rounded-sm px-3 py-2 text-sm" style={{ background: "var(--green-faint)", color: "var(--green)" }}>
          ✓ First 3 questions free · No credit card required · Full access $19/month
        </div>
        <Link className="font-ui text-xs uppercase tracking-wider text-stone-500" href="/admin">
          Admin Dashboard →
        </Link>
        <Link className="font-ui text-xs uppercase tracking-wider text-stone-500" href="/login">
          Existing Student Login →
        </Link>
      </main>
    </div>
  );
}
