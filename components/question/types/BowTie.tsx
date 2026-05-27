"use client";

import { useMemo, useState } from "react";

export function BowTie({
  causes,
  outcomes,
  onSubmit,
}: {
  causes: string[];
  outcomes: string[];
  onSubmit: (answer: { causes: string[]; outcomes: string[] }) => void;
}) {
  const [cause, setCause] = useState<string>("");
  const [outcome, setOutcome] = useState<string>("");
  const canSubmit = useMemo(() => Boolean(cause && outcome), [cause, outcome]);

  return (
    <div className="grid gap-4">
      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded border p-3">
          <p className="font-ui mb-2 text-xs">CAUSES</p>
          {causes.map((opt) => (
            <button key={opt} onClick={() => setCause(opt)} className="mb-1 block w-full rounded border px-2 py-1 text-left text-sm">
              {opt}
            </button>
          ))}
        </div>
        <div className="grid place-items-center rounded border p-3 text-center">
          <div>
            <p className="font-ui text-xs">INTERVENTION</p>
            <p className="font-heading text-xl font-black">Prioritize Immediate Action</p>
          </div>
        </div>
        <div className="rounded border p-3">
          <p className="font-ui mb-2 text-xs">OUTCOMES</p>
          {outcomes.map((opt) => (
            <button key={opt} onClick={() => setOutcome(opt)} className="mb-1 block w-full rounded border px-2 py-1 text-left text-sm">
              {opt}
            </button>
          ))}
        </div>
      </div>
      <button disabled={!canSubmit} onClick={() => onSubmit({ causes: [cause], outcomes: [outcome] })} className="rounded bg-green-900 px-3 py-2 text-sm font-semibold text-white disabled:opacity-40">
        Submit
      </button>
    </div>
  );
}
