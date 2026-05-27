"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return setError(error.message);
    router.push("/dashboard");
  }

  return (
    <div className="mx-auto mt-24 max-w-md rounded border bg-white p-6">
      <h1 className="font-heading text-3xl font-black">Login</h1>
      <form className="mt-4 grid gap-3" onSubmit={onSubmit}>
        <input name="email" type="email" required className="rounded border px-3 py-2 text-sm" placeholder="Email" />
        <input name="password" type="password" required className="rounded border px-3 py-2 text-sm" placeholder="Password" />
        {error ? <p className="text-sm text-red-700">{error}</p> : null}
        <button className="rounded bg-green-900 px-3 py-2 text-sm font-semibold text-white">Continue</button>
      </form>
    </div>
  );
}
