import { CJMMScores, ReasoningLevel } from "@/lib/types";

export function getLevel(avgScore: number): ReasoningLevel {
  if (avgScore < 40) return "developing";
  if (avgScore < 60) return "beginning";
  if (avgScore < 80) return "competent";
  return "proficient";
}

export function getAvgCJMM(scores: CJMMScores): number {
  const vals = Object.values(scores);
  return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
}
