import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { question, answer } = await req.json();
  const expected = question?.correct;
  const correct = JSON.stringify(answer) === JSON.stringify(expected);
  let partial = false;

  if (!correct && expected && typeof expected === "object" && answer && typeof answer === "object") {
    const expectedEntries = Object.entries(expected);
    const matched = expectedEntries.filter(([k, v]) => JSON.stringify((answer as Record<string, unknown>)[k]) === JSON.stringify(v)).length;
    partial = matched > 0 && matched < expectedEntries.length;
  }

  return NextResponse.json({
    correct,
    partial,
    score: correct ? 100 : partial ? 60 : 30,
    feedback: correct
      ? "Correct prioritization. You recognized the unstable respiratory trend and selected the intervention with strongest physiologic benefit."
      : "Focus on prioritizing oxygenation/perfusion cues first. In this CJMM step, immediate instability should drive action selection.",
    cjmmImpact: correct ? 6 : partial ? 2 : -4,
    lasaterImpact: correct ? 5 : partial ? 1 : -3,
  });
}
