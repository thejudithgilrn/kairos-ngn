"use client";

import { useState } from "react";

export function Highlight({
  sentenceParts,
  onSubmit,
}: {
  sentenceParts: string[];
  onSubmit: (answer: string[]) => void;
}) {
  const [selected, setSelected] = useState<string[]>([]);

  function toggle(part: string) {
    setSelected((prev) =>
      prev.includes(part) ? prev.filter((v) => v !== part) : [...prev, part]
    );
  }

  return (
    <div className="grid gap-3">
      <p className="font-ui text-xs">Select all significant findings.</p>
      <p className="text-sm leading-7">
        {sentenceParts.map((part) => (
          <button
            key={part}
            type="button"
            onClick={() => toggle(part)}
            className="mr-1 rounded px-1"
            style={{ background: selected.includes(part) ? "var(--gold-faint)" : "transparent" }}
          >
            {part}
          </button>
        ))}
      </p>
      <button onClick={() => onSubmit(selected)} className="rounded bg-green-900 px-3 py-2 text-sm font-semibold text-white">
        Submit
      </button>
    </div>
  );
}
