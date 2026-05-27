"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";

const programs = [
  "ADN Program",
  "BSN Program",
  "Accelerated BSN",
  "LPN/LVN to RN Bridge",
  "MSN Entry-Level",
  "RN — Retaking NCLEX",
  "Graduate Nursing Student",
];

const nclexDates = [
  "Within 1 month",
  "1–3 months",
  "3–6 months",
  "6–12 months",
  "More than 12 months away",
];

export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(e.currentTarget);
    const payload = {
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      password: String(form.get("password") ?? ""),
      program: String(form.get("program") ?? ""),
      nclexDate: String(form.get("nclexDate") ?? ""),
    };

    const supabase = createClient();
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: payload.email,
      password: payload.password,
      options: { data: { name: payload.name } },
    });
    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      await fetch("/api/profile/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: data.user.id, ...payload }),
      });
    }

    setLoading(false);
    router.push("/dashboard");
  }

  return (
    <form className="grid gap-3" onSubmit={onSubmit}>
      <input name="name" required className="rounded-sm border px-3 py-2 text-sm" placeholder="Full Name" />
      <input name="email" required type="email" className="rounded-sm border px-3 py-2 text-sm" placeholder="Email" />
      <input name="password" required type="password" className="rounded-sm border px-3 py-2 text-sm" placeholder="Password" />
      <select name="program" required className="rounded-sm border px-3 py-2 text-sm">
        {programs.map((v) => (
          <option key={v}>{v}</option>
        ))}
      </select>
      <select name="nclexDate" required className="rounded-sm border px-3 py-2 text-sm">
        {nclexDates.map((v) => (
          <option key={v}>{v}</option>
        ))}
      </select>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      <Button disabled={loading} type="submit">
        {loading ? "Creating account..." : "Begin Free Diagnostic →"}
      </Button>
    </form>
  );
}
