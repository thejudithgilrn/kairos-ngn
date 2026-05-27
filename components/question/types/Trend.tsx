"use client";

import { useState } from "react";

export function Trend({
  rows,
  options,
  onSubmit,
}: {
  rows: { metric: string; t1: string; t2: string; t3: string }[];
  options: string[];
  onSubmit: (answer: string) => void;
}) {
  const [selected, setSelected] = useState("");

  return (
    <div className="grid gap-3">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            <th className="border p-2 text-left">Metric</th>
            <th className="border p-2">0800</th>
            <th className="border p-2">1200</th>
            <th className="border p-2">1600</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.metric}>
              <td className="border p-2">{r.metric}</td>
              <td className="border p-2">{r.t1}</td>
              <td className="border p-2">{r.t2}</td>
              <td className="border p-2">{r.t3}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="grid gap-2">
        {options.map((opt) => (
          <label key={opt} className="rounded border p-2 text-sm">
            <input
              className="mr-2"
              type="radio"
              checked={selected === opt}
              onChange={() => setSelected(opt)}
            />
            {opt}
          </label>
        ))}
      </div>
      <button onClick={() => onSubmit(selected)} className="rounded bg-green-900 px-3 py-2 text-sm font-semibold text-white">
        Submit
      </button>
    </div>
  );
}
