"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function AdminLockForm() {
  const [password, setPassword] = useState("");
  const router = useRouter();

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    router.push(`/admin/dashboard?key=${encodeURIComponent(password)}`);
  }

  return (
    <form className="mt-4 grid gap-3" onSubmit={onSubmit}>
      <input
        className="rounded border px-3 py-2 text-sm"
        type="password"
        placeholder="Admin password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button className="rounded bg-stone-900 px-3 py-2 text-sm font-semibold text-white">
        Enter Dashboard
      </button>
    </form>
  );
}
