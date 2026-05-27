"use client";

import { useState } from "react";

export function DragDrop({
  chips,
  zones,
  onSubmit,
}: {
  chips: string[];
  zones: string[];
  onSubmit: (answer: Record<string, string>) => void;
}) {
  const [assignments, setAssignments] = useState<Record<string, string>>({});

  return (
    <div className="grid gap-3">
      <p className="text-sm">Click a zone to cycle chip placement.</p>
      <div className="grid gap-2 md:grid-cols-2">
        {zones.map((z, idx) => (
          <button
            key={z}
            onClick={() =>
              setAssignments((prev) => ({
                ...prev,
                [z]: chips[(chips.indexOf(prev[z]) + 1 + chips.length) % chips.length] ?? chips[idx % chips.length],
              }))
            }
            className="rounded border p-3 text-left text-sm"
          >
            <span className="font-ui mr-2 text-xs">{z}:</span>
            {assignments[z] ?? "Tap to assign"}
          </button>
        ))}
      </div>
      <button onClick={() => onSubmit(assignments)} className="rounded bg-green-900 px-3 py-2 text-sm font-semibold text-white">
        Submit
      </button>
    </div>
  );
}
