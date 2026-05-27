import { z } from "zod";

const cjmmDomain = z.enum([
  "recognize",
  "analyze",
  "prioritize",
  "generate",
  "action",
  "evaluate",
]);
const lasaterDomain = z.enum([
  "noticing",
  "interpreting",
  "responding",
  "reflecting",
]);
const difficulty = z.enum(["developing", "beginning", "competent", "proficient"]);

const baseQuestion = z.object({
  stem: z.string(),
  cjmmDomain: cjmmDomain,
  lasaterDomain: lasaterDomain,
  difficulty: difficulty,
  caseArea: z.string(),
  explanation: z.string(),
  case: z.object({
    patient: z.string(),
    context: z.string(),
    vitals: z.record(z.string()),
    abnormalVitals: z.array(z.string()),
  }),
});

export const bowtieSchema = baseQuestion.extend({
  type: z.literal("bowtie"),
  causes: z.object({
    options: z.array(z.string()).min(3),
    correct: z.array(z.string()).min(1),
  }),
  action: z.object({ label: z.string() }),
  outcomes: z.object({
    options: z.array(z.string()).min(3),
    correct: z.array(z.string()).min(1),
  }),
  correct: z.object({
    causes: z.array(z.string()),
    outcomes: z.array(z.string()),
  }),
});

export const clozeSchema = baseQuestion.extend({
  type: z.literal("cloze"),
  clozeText: z.string(),
  blanks: z.array(
    z.object({
      id: z.string(),
      options: z.array(z.string()).min(3),
    })
  ),
  correct: z.record(z.string()),
});

export const highlightSchema = baseQuestion.extend({
  type: z.literal("highlight"),
  sentenceParts: z.array(z.string()).min(3),
  correct: z.array(z.string()).min(1),
});

export const dragDropSchema = baseQuestion.extend({
  type: z.literal("dragdrop"),
  chips: z.array(z.string()).min(3),
  zones: z.array(z.string()).min(2),
  correct: z.record(z.string()),
});

export const matrixSchema = baseQuestion.extend({
  type: z.literal("matrix"),
  rows: z.array(z.string()).min(2),
  columns: z.array(z.string()).min(2),
  correct: z.record(z.string()),
});

export const trendSchema = baseQuestion.extend({
  type: z.literal("trend"),
  trendRows: z.array(
    z.object({
      metric: z.string(),
      t1: z.string(),
      t2: z.string(),
      t3: z.string(),
    })
  ),
  options: z.array(z.string()).min(3),
  correct: z.string(),
});

export const questionSchemas = {
  bowtie: bowtieSchema,
  cloze: clozeSchema,
  highlight: highlightSchema,
  dragdrop: dragDropSchema,
  matrix: matrixSchema,
  trend: trendSchema,
};

export const scoreSchema = z.object({
  correct: z.boolean(),
  partial: z.boolean(),
  score: z.number().min(0).max(100),
  feedback: z.string(),
  cjmmImpact: z.number().min(-8).max(8),
  lasaterImpact: z.number().min(-8).max(8),
});
