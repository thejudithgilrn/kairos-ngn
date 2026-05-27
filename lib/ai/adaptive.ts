import { CJMMDomain, CJMMScores, ItemType } from "@/lib/types";

export function selectNextItemType(
  scores: CJMMScores,
  sessionHistory: { item_type: ItemType }[]
): ItemType {
  const lowest = Object.entries(scores).sort(([, a], [, b]) => a - b)[0]?.[0] as
    | CJMMDomain
    | undefined;

  const domainToItemType: Record<CJMMDomain, ItemType> = {
    recognize: "highlight",
    analyze: "trend",
    prioritize: "bowtie",
    generate: "dragdrop",
    action: "cloze",
    evaluate: "matrix",
  };

  if (!lowest) return "bowtie";
  const lastType = sessionHistory.at(-1)?.item_type;
  const preferred = domainToItemType[lowest];
  if (preferred !== lastType) return preferred;

  const secondLowest = Object.entries(scores).sort(([, a], [, b]) => a - b)[1]?.[0] as
    | CJMMDomain
    | undefined;

  return secondLowest ? domainToItemType[secondLowest] : preferred;
}
