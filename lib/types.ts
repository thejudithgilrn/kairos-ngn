export type CJMMDomain =
  | "recognize"
  | "analyze"
  | "prioritize"
  | "generate"
  | "action"
  | "evaluate";

export type LasaterDomain =
  | "noticing"
  | "interpreting"
  | "responding"
  | "reflecting";

export type ItemType =
  | "adaptive"
  | "bowtie"
  | "cloze"
  | "highlight"
  | "dragdrop"
  | "matrix"
  | "trend";

export type ReasoningLevel =
  | "developing"
  | "beginning"
  | "competent"
  | "proficient";

export type CJMMScores = Record<CJMMDomain, number>;
export type LasaterScores = Record<LasaterDomain, number>;

export interface QuestionShape {
  type: ItemType;
  stem: string;
  cjmmDomain: CJMMDomain;
  lasaterDomain: LasaterDomain;
  difficulty: ReasoningLevel;
  caseArea: string;
  explanation: string;
  case: {
    patient: string;
    context: string;
    vitals: Record<string, string>;
    abnormalVitals: string[];
  };
  causes?: { options: string[]; correct: string[] };
  outcomes?: { options: string[]; correct: string[] };
  action?: { label: string };
  options?: string[];
  correct?: unknown;
}
