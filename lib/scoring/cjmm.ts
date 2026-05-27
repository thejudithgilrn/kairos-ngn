import { CJMMDomain, CJMMScores } from "@/lib/types";

export function updateCJMMScore(
  current: CJMMScores,
  domain: CJMMDomain,
  impact: number
): CJMMScores {
  const clampedImpact = Math.max(-8, Math.min(8, impact));
  const updated = { ...current };
  const newScore = Math.max(0, Math.min(100, current[domain] + clampedImpact));
  updated[domain] = Math.round(newScore);
  return updated;
}
