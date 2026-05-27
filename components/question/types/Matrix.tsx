"use client";

import { useState } from "react";

export function Matrix({
  rows,
  columns,
  onSubmit,
}: {
  rows: string[];
  columns: string[];
  onSubmit: (answer: Record<string, string>) => void;
}) {
  const [answer, setAnswer] = useState<Record<string, string>>({});

  return (
    <div className="grid gap-3">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            <th className="border p-2 text-left">Finding</th>
            {columns.map((c) => (
              <th key={c} className="border p-2 text-left">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r}>
              <td className="border p-2">{r}</td>
              {columns.map((c) => (
                <td key={`${r}-${c}`} className="border p-2">
                  <input
                    type="radio"
                    checked={answer[r] === c}
                    onChange={() => setAnswer((prev) => ({ ...prev, [r]: c }))}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => onSubmit(answer)} className="rounded bg-green-900 px-3 py-2 text-sm font-semibold text-white">
        Submit
      </button>
    </div>
  );
}
