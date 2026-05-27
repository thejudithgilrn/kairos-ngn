import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    summary:
      "You are demonstrating stronger cue recognition than action evaluation. Your highest gains came from prioritization items.",
    gaps: [
      { domain: "evaluate", priority: "high", description: "Strengthen post-intervention reassessment." },
      { domain: "analyze", priority: "medium", description: "Link clustered findings to likely pathophysiology faster." },
      { domain: "generate", priority: "low", description: "Expand backup intervention options in ambiguous cases." },
    ],
    studyPlan: [
      {
        rank: 1,
        topic: "Outcome Reassessment",
        detail: "Practice 10 debrief stems focused on trend interpretation.",
        resource: "NCSBN CJMM outcomes review",
        clinicalApplication: "Post-diuretic cardiopulmonary checks at 15-minute intervals.",
      },
    ],
  });
}
