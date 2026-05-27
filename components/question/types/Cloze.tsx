"use client";

import { useState } from "react";

export function Cloze({
  text,
  blanks,
  onSubmit,
}: {
  text: string;
  blanks: { id: string; options: string[] }[];
  onSubmit: (answer: Record<string, string>) => void;
}) {
  const [answers, setAnswers] = useState<Record<string, string>>({});

  return (
    <div className="grid gap-3">
      <p className="text-sm">{text}</p>
      {blanks.map((b) => (
        <label key={b.id} className="grid gap-1 text-sm">
          <span className="font-ui text-xs">{b.id.toUpperCase()}</span>
          <select
            className="rounded border px-2 py-1"
            value={answers[b.id] ?? ""}
            onChange={(e) => setAnswers((prev) => ({ ...prev, [b.id]: e.target.value }))}
          >
            <option value="">Select</option>
            {b.options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </label>
      ))}
      <button onClick={() => onSubmit(answers)} className="rounded bg-green-900 px-3 py-2 text-sm font-semibold text-white">
        Submit
      </button>
    </div>
  );
}
